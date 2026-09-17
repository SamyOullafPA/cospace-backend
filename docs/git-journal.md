# Samy's learning journal with Git
## Git init 
Use the command `git init` in your working folder to initialise a local repository here.

Then to attach your git user to it, use the commands `git config --global user.name "UsernameHere"` and `git config --global user.email "EmailHere"`, and you can double check via `git config --list`.

## Git add
To add our changes to the staging area, we use the command `git add file_name.ext`.

If we want to add all changes of ONLY the current working directory and its subsidaries, it would be `git add .`

If we want to add all changes of the entire local repository regardless of the current working directory, it would be `git add -A`.

## Git commit
To lock in those changes permanently from the staging area to the real repository, we use comitting.

To commit, we use the command `git commit -m "Message Here"`, the `-m` flag allows for a message to be attached to the commit, which is useful for other developers to understand the changes without having to look at the change of the source code itself.

We can use `git log` to view the commit history of the repository, and we can simplify it further with the `--oneline` flag.

## Git branches
In software development, you do not want to write new features or experiment with code directly onto the main branch of the project, as if you make a mistake, it will break the application for everyone.

To create a branch, we can use the command `git branch BranchName`, and to switch to it, we use `git switch BranchName`.

We can list the **local** branches that we have by running `git branch`, which will display all branches, and signifies the main branch by the star (`*`) next to the name of a branch.

We can list the **remote** branches that we have by running `git branch -r`.

We can merge a branch into our current branch by running `git merge BranchName`.

If you want to rename a branch before you pushed it, use the command `git branch -m NewBranchName`.

### Deleting a branch
To delete a local branch, we can use `git branch -d BranchName`, however, this will only work if the branch has already been merged.

If the branch has not been merged already, we can force a delete by running `git branch -D BranchName`.

Lastly, to delete a remote branch, we run `git push origin --delete BranchName`.

## Git push
Currently, our repository only exists locally on our hard drive. Although it is fully tracked locally, it is risky to only store it on our physical machine, also it doesn't allow for collaboration work easily. This is why we push our work onto Github.

Initially, we need to connect to the remote by using `git remote add origin UrlHere`.

It is important when connecting to Github, to rename the `master` branch to the `main` branch by running `git branch -M main`.

Lastly, push and link the branch by running `git push -u origin main`, it is important to use the `-u` flag to initiate the link.

We can verify if we have connected to the online git repository by running `git remote -v`, which should return the corresponding URL twice, for fetching and pushing.

## Git pull
When others make changes to the codebase and push it onto the remote server, we need to be able to fetch these changes to keep them on our device if we want to contribute more changes to the project.

We can fetch the changes by running `git fetch`, but this will not integrate the changes. To integrate them, we run `git merge`.

However, a simpler way of doing this is by running `git pull`, we can fetch the changes and integrate them in one command.

### Merge conflicts
Sometimes when working collaboratively using git, it is possible that your local and online repository will **diverge**, this occurs when you make a change to your local repository and someone else makes a change to the online repository, and you are no longer in sync.

A merge conflict occurs when you both have made changes to the same line of code, so git intercepts the merge and asks you which one to keep.