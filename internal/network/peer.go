package network

import (
	"context"
	"fmt"
	"time"

	libp2p "github.com/libp2p/go-libp2p"
	host "github.com/libp2p/go-libp2p/core/host"
	"github.com/libp2p/go-libp2p/core/network"
	peer "github.com/libp2p/go-libp2p/core/peer"
	mdns "github.com/libp2p/go-libp2p/p2p/discovery/mdns"
	tcp "github.com/libp2p/go-libp2p/p2p/transport/tcp"
	ma "github.com/multiformats/go-multiaddr"
)

const serviceTag = "mirrornet-p2p"

type Notifee struct {
	h host.Host
}

func (n *Notifee) HandlePeerFound(pi peer.AddrInfo) {
	fmt.Println("👀 HandlePeerFound triggered")
	fmt.Printf("🔗 Found peer: %s\n", pi.ID.String())

	if n.h.Network().Connectedness(pi.ID) == network.Connected {
		fmt.Printf("ℹ️ Already connected to peer: %s\n", pi.ID.String())
		return
	}

	err := n.h.Connect(context.Background(), pi)
	if err != nil {
		fmt.Printf("⚠️ Connection failed to peer %s: %s\n", pi.ID.String(), err)
		return
	}

	fmt.Printf("✅ Connected to peer: %s\n", pi.ID.String())
}

func StartPeerDiscovery() (host.Host, error) {
	listenAddr, _ := ma.NewMultiaddr("/ip4/0.0.0.0/tcp/0")
	node, err := libp2p.New(
		libp2p.ListenAddrs(listenAddr),
		libp2p.Transport(tcp.NewTCPTransport),
	)
	if err != nil {
		return nil, err
	}

	fmt.Println("🚀 MirrorNet Node started")
	fmt.Println("🆔 Peer ID:", node.ID().String())
	fmt.Println("🌐 Listening on:")
	for _, addr := range node.Addrs() {
		fmt.Printf("   → %s/p2p/%s\n", addr.String(), node.ID().String())
	}

	notifee := &Notifee{h: node}
	mdnsService := mdns.NewMdnsService(node, serviceTag, notifee)
	if err := mdnsService.Start(); err != nil {
		return nil, fmt.Errorf("❌ Failed to run mDNS: %w", err)
	}

	if err := mdnsService.Start(); err != nil {
		return nil, fmt.Errorf("❌ Failed to run mDNS: %w", err)
	}

	fmt.Println("🔍 mDNS discovery running with tag:", serviceTag)

	go func() {
		for {
			time.Sleep(time.Minute)
		}
	}()

	return node, nil
}
