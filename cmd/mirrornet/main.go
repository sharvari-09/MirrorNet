package main

import (
	"fmt"

	"github.com/bhaktimore18/mirrornet/internal/crypto"
)

func main() {
	fmt.Println("MirrorNet Identity Booting....")

	identity, err := crypto.GenerateIdentity()
	if err != nil {
		panic(err)
	}

	fmt.Println("Identity Generated!")

	//saving the identity to disk i.e. inside .mirror folder

	err = identity.SaveIdentity(".mirror_id")
	if err != nil {
		panic(err)
	}

	fmt.Println("Identity saved to .mirror_id")

	//loading it back to confirm
	loaded, err := crypto.LoadIdentity(".mirror_id")
	if err != nil {
		panic(err)
	}

	fmt.Println("Loaded Public key : ", loaded.PublicKey)
}
