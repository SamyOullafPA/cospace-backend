# Samy's learning journal with Git
## Git init 
Use the command `git init` in your working folder to initialise a local repository here.

Then to attach your git user to it, use the commands `git config --global user.name "UsernameHere"` and `git config --global user.email "EmailHere"`, and you can double check via `git config --list`.

## Git add
To add our changes to the staging area, we use the command `git add file_name.ext`.

If we want to add all changes of ONLY the current working directory and its subsidaries, it would be `git add .`

If we want to add all changes of the entire local repository regardless of the current working directory, it would be `git add -A`