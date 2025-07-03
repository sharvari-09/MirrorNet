package main

import (
	"flag"
	"fmt"
	"log"
	"os"

	mycrypto "github.com/bhaktimore18/mirrornet/internal/crypto"
	"github.com/bhaktimore18/mirrornet/internal/httpapi"
	"github.com/bhaktimore18/mirrornet/internal/network"
	lpcrypto "github.com/libp2p/go-libp2p/core/crypto"
)

func main() {
	httpPort := flag.String("port", "8080", "Port for HTTP API server")
	libp2pPort := flag.Int("libp2p-port", 44111, "Port for libp2p TCP transport") 

	idPath := flag.String("id", ".mirror_id", "Path to identity file")
	flag.Parse()

	fmt.Println("📦 MirrorNet Identity Booting...")

	var identity *mycrypto.Identity
	var err error

	if _, err := os.Stat(*idPath); err == nil {
		identity, err = mycrypto.LoadIdentity(*idPath)
		if err != nil {
			log.Fatal("❌ Failed to load identity:", err)
		}
		fmt.Println("✅ Loaded identity from", *idPath)
	} else {
		identity, err = mycrypto.GenerateIdentity()
		if err != nil {
			log.Fatal("❌ Failed to generate identity:", err)
		}
		err = identity.SaveIdentity(*idPath)
		if err != nil {
			log.Fatal("❌ Failed to save identity:", err)
		}
		fmt.Println("✅ New identity generated and saved at", *idPath)
	}

	lpPriv, err := lpcrypto.UnmarshalEd25519PrivateKey(identity.PrivateKey)
if err != nil {
    log.Fatal("❌ Failed to convert to libp2p key:", err)
}


	// ✅ Start libp2p host with identity
	host, err := network.StartPeerDiscoveryWithIdentity(lpPriv, *libp2pPort)
	if err != nil {
		log.Fatal("❌ Failed to start peer discovery:", err)
	}

	// ✅ Start HTTP API Server
	api := httpapi.NewServer(host, *httpPort)
	go api.Start()

	select {} // Keep running forever
}
