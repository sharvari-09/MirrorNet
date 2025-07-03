package crypto

import (
	"crypto/ed25519" // For generating public-private key pairs
	"crypto/rand"    // Used to securely generate random numbers
	"encoding/hex"   // Helps convert bytes to readable hex strings
	"errors"         // For returning custom error messages
	"fmt"            // For string formatting
	"os"             // To read/write files
)



// Identity just holds a user's keys — public (you can share) and private (keep this safe!)
type Identity struct {
	PublicKey  ed25519.PublicKey  //used to verify stuff we signed, safe to give out
	PrivateKey []byte //used to sign stuff, keep this private
}

// GenerateIdentity creates a fresh new key pair (basically a new identity)
func GenerateIdentity() (*Identity, error) {
	//generate a new public-private key pair using a secure random generator
	publicKey, privateKey, err := ed25519.GenerateKey(rand.Reader)
	if err != nil {
		//if something breaks while generating, return the error
		return nil, err
	}

	// wrap the keys in our Identity struct and return it
	return &Identity{
		PublicKey:  publicKey,
		PrivateKey: privateKey,
	}, nil
}

// SaveIdentity saves our keys to a file so we can reuse them later

func (id *Identity) SaveIdentity(path string) error {
	//let’s not overwrite existing identity files accidentally :)
	if _, err := os.Stat(path); err == nil {
		return errors.New("identity already exists at this path")
	}

	//convert keys to hex strings so they’re easier to store and read
	data := fmt.Sprintf("%s\n%s",
		hex.EncodeToString(id.PublicKey),  //first line = public key
		hex.EncodeToString(id.PrivateKey), //second line = private key
	)

	//save to file with 0600 permissions (only you can read/write)
	return os.WriteFile(path, []byte(data), 0600)
}

// LoadIdentity reads keys from a file and puts them back into an Identity struct
func LoadIdentity(path string) (*Identity, error) {
	//read the file
	content, err := os.ReadFile(path)
	if err != nil {
		return nil, err //if something went wrong while reading
	}

	//we're expecting 2 lines: public key and private key
	lines := string(content)
	var pubStr, privStr string
	fmt.Sscanf(lines, "%s\n%s", &pubStr, &privStr)

	//then we convert hex strings back to raw bytes
	pubKey, err := hex.DecodeString(pubStr)
	if err != nil {
		return nil, err
	}

	privKey, err := hex.DecodeString(privStr)
	if err != nil {
		return nil, err
	}

	//return our keys wrapped nicely in the Identity struct
	return &Identity{
		PublicKey:  ed25519.PublicKey(pubKey),
		PrivateKey: ed25519.PrivateKey(privKey),
	}, nil
}
