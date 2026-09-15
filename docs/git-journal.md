# Samy's learning journal with Git
## Git init 
Use the command `git init` in your working folder to initialise a local repository here.

Then to attach your git user to it, use the commands `git config --global user.name "UsernameHere"` and `git config --global user.email "EmailHere"`, and you can double check via `git config --list`.

## Git add
To add our changes to the staging area, we use the command `git add file_name.ext`.

If we want to add all changes of ONLY the current working directory and its subsidaries, it would be `git add .`

If we want to add all changes of the entire local repository regardless of the current working directory, it would be `git add -A`

## Git commit
To lock in those changes permanently from the staging area to the real repository, we use comitting.

To commit, we use the command `git commit -m "Message Here"`, the `-m` flag allows for a message to be attached to the commit, which is useful for other developers to understand the changes without having to look at the change of the source code itself.

We can use `git log` to view the commit history of the repository, and we can simplify it further with the `--oneline` flag.
