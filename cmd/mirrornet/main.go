package main

import (
	"flag"
	"fmt"
	"log"
	"os"

	"github.com/bhaktimore18/mirrornet/internal/crypto"
	"github.com/bhaktimore18/mirrornet/internal/network"
)

func main() {
	idPath := flag.String("id", ".mirror_id", "Path to identity file")
	flag.Parse()

	fmt.Println("📦 MirrorNet Identity Booting...")

	var identity *crypto.Identity
	var err error

	if _, err := os.Stat(*idPath); err == nil {
		identity, err = crypto.LoadIdentity(*idPath)
		if err != nil {
			log.Fatal("❌ Failed to load identity:", err)
		}
		fmt.Println("✅ Loaded identity from", *idPath)
	} else {
		identity, err = crypto.GenerateIdentity()
		if err != nil {
			log.Fatal("❌ Failed to generate identity:", err)
		}

		err = identity.SaveIdentity(*idPath)
		if err != nil {
			log.Fatal("❌ Failed to save identity:", err)
		}
		fmt.Println("✅ New identity generated and saved at", *idPath)
	}

	_, err = network.StartPeerDiscovery()
	if err != nil {
		log.Fatal(err)
	}

	select {}
}
