add ssh key to github

https://help.github.com/enterprise/2.10/user/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/

// test ssh key with github
ssh -T git@github.com  

// create a github repository for the project.
// go to github.
createa  new repository.
git remote add origin git@github.com:kyoungd/{repositoryname}.git
git push -u origin master

git status
git add .
git commit -m "message"
git commit push

// create a heroku repository for the project
heroku login   // in the cmd shell only. it doesn't work in git bash.
heroku create	// create a repository for git@heroku.com
// change the port.  use
process.env.PORT || 3000
// add the "start" in the package.json file.  Under the "scripts:" tag.
"start" : "node server.js"
// push project to heroku
git push heroku
heroku open

// this works.
nodemon --exec "npm test"
