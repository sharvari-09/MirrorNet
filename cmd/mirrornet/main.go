package main

import (
	"fmt"
	"os"

	"github.com/bhaktimore18/mirrornet/internal/crypto"
)

func main() {
	fmt.Println("MirrorNet Identity Booting...")

	const identityPath = ".mirror_id"
	var identity *crypto.Identity

	//Load or create identity
	if _, err := os.Stat(identityPath); err == nil {
		fmt.Println("Existing identity found. Loading...")
		identity, err = crypto.LoadIdentity(identityPath)
		if err != nil {
			panic("Failed to load identity: " + err.Error())
		}
	} else {
		fmt.Println("✨ No identity found. Generating new one...")
		identity, err = crypto.GenerateIdentity()
		if err != nil {
			panic("Failed to generate identity: " + err.Error())
		}
		err = identity.SaveIdentity(identityPath)
		if err != nil {
			panic("Failed to save identity: " + err.Error())
		}
		fmt.Println("New identity saved to", identityPath)
	}

	//Print identity info
	fmt.Println("Identity Loaded Successfully")
	fmt.Printf("Public Key: %x\n", identity.PublicKey)
	fmt.Printf("Peer ID: %s\n", identity.PeerID)

	// Test signing + verification
	msg := []byte("Hello MirrorNet!")
	sig, _ := identity.SignMessage(msg)
	fmt.Printf("Signature: %x\n", sig)

	if identity.VerifyMessage(msg, sig) {
		fmt.Println("Signature Verified: Authentic message!")
	} else {
		fmt.Println("Signature Verification Failed!")
	}
}
