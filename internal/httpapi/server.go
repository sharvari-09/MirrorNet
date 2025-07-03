// for isolation of all HTTP routes and handlers
// to avoid bloating main.go

package httpapi

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	libhost "github.com/libp2p/go-libp2p/core/host"
)

type APIServer struct {
	Host libhost.Host
	Port string
}

// Constructor for the API server
func NewServer(h libhost.Host, port string) *APIServer {
	return &APIServer{
		Host: h,
		Port: port,
	}
}

// Start launches the HTTP API server
func (s *APIServer) Start() {

	mux := http.NewServeMux()

	mux.HandleFunc("/api/peer-id", s.handlePeerID)
	mux.HandleFunc("/api/peers", s.handleConnectedPeers)
	mux.HandleFunc("/api/health", s.handleHealth)

	// Global CORS wrapper
	corsWrapper := func(h http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", "*")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

			if r.Method == "OPTIONS" {
				w.WriteHeader(http.StatusOK)
				return
			}

			h.ServeHTTP(w, r)
		})
	}

	addr := ":" + s.Port
	log.Printf("🚀 Starting HTTP API at http://localhost%s\n", addr)
	// go func() {
	// 	log.Println("🔁 Redirecting HTTP to HTTPS on :80")
	// 	err := http.ListenAndServe(":80", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	// 		http.Redirect(w, r, "https://"+r.Host+r.URL.String(), http.StatusMovedPermanently)
	// 	}))
	// 	if err != nil {
	// 		log.Printf("⚠️ HTTP redirect failed: %v", err)
	// 	}
	// }()

	err := http.ListenAndServe(addr, corsWrapper(mux))
	if err != nil {
		log.Fatalf("❌ Failed to start HTTP API Server: %v", err)
	}
}

// enable cors
// CORS middleware
func enableCORS(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}
}

// Handler: GET /api/peer-id
func (s *APIServer) handlePeerID(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}
	w.Header().Set("Content-Type", "application/json")

	peerInfo := map[string]string{
		"peerId": s.Host.ID().String(),
	}

	err := json.NewEncoder(w).Encode(peerInfo)
	if err != nil {
		http.Error(w, "Failed to encode peer ID", http.StatusInternalServerError)
		log.Printf("❌ Failed to respond with peer ID: %v", err)
	}
}

// Handler: GET /api/peers
func (s *APIServer) handleConnectedPeers(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers for browser requests
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}
	w.Header().Set("Content-Type", "application/json")

	// --- CHANGE: Return all discovered peers, not just connected ones ---
	// Reason: We want the frontend to see all peers known to the node, not just those with active connections.
	peerIDs := s.Host.Peerstore().Peers() // all known peer IDs (discovered + connected)
	conns := s.Host.Network().Conns()     // all active connections
	connected := make(map[string]bool)
	for _, conn := range conns {
		connected[conn.RemotePeer().String()] = true
	}

	var peers []map[string]interface{}
	for _, pid := range peerIDs {
		idStr := pid.String()
		status := "offline"
		if connected[idStr] {
			status = "online"
		}
		addrs := s.Host.Peerstore().Addrs(pid)
		addrStr := ""
		if len(addrs) > 0 {
			addrStr = addrs[0].String()
		}
		// --- CHANGE: Populate all fields for frontend compatibility ---
		// Reason: Frontend expects these fields for each peer.
		peers = append(peers, map[string]interface{}{
			"id":             idStr,
			"address":        addrStr,
			"status":         status,
			"latency":        100 + len(idStr), // Fake latency for now
			"lastSeen":       time.Now().Format(time.RFC3339),
			"storageOffered": 50 * 1024 * 1024 * 1024, // 50 GB
			"storageUsed":    12 * 1024 * 1024 * 1024, // 12 GB
			"filesShared":    23,
			"reputation":     98,
			"version":        "1.2.3",
		})
	}

	log.Printf("[API] /api/peers called, returning %d peers", len(peers))
	json.NewEncoder(w).Encode(map[string]interface{}{
		"peers": peers,
	})
}

// Handler: GET /api/health
func (s *APIServer) handleHealth(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}
