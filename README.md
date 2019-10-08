# get-gpg-keys-from-github-following

A simple program which will look through a users list of followed users and generate a gpg key file containing the public keys of all users who have added their gpg key to github.

For instance if you run `npx get-gpg-keys-from-github-following morten-olsen` you will end up with a `keys.asc` file with gpg key for the users I follow who has gpg keys attached to their profile