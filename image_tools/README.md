# Run Image Tools
## Install Node JS and NPM
1. Get Mac Binary from node repo https://nodejs.org/dist/v14.15.4/node-v14.15.4.pkg
2. Unpack the package to the desktop.
3. Follow Installer
4. Check that node.js is installed by running `node -v` in the command line (iTerm or "terminal" from applciations).
5. Check that `npm` is installed by running `npm -v` in the command line.

## Install Local Dependencies
1. In the terminal, navigate to the `image_tools` folder in this project (cd /.
1. run `npm install`.

## Turn on the Server
1. In the terminal (from `~/../image_tools`) `npm start`.
2. Navigate to `http://localhost:3000` in the web browser to see Mirador interface.

# Using the System
## Creating Annotations
After navigating to the annotation creation interface in the browser (at `http://locahost:3000`), use the tools to navigate between pages, zoom in, and select regions. Complete the popup form and save the annotation. It should now be visible as you navigate through the text. You should also be able to see existing annotations in the text.

## Viewing Raw JSON Annotations
To view the raw JSON of the annotations, navigate the browser to `http://localhost:3000/regions/`. This will list all annotations. Here, you can copy and paste them, or just examine them quickly, without needing to open a text editor. It's also a way to sanity check that the system is working properly.

To view the raw JSON in a text editor, open `db.json` from the `image_tools` directory in this project.

## Pushing New Annotations to Github
Whenever you create new annotations, the `db.json` file in `image_tools` will be updated on the file system. You can confirm this by navigating to the `image-tools` directory using the `cd` command, and typing `git status` into the terminal. There is a hidden `.git` directory in this location, which is how git knows where it is. Typing `git status` from another directory outside the florentine codex project directory will show different results.

The `git status` command shows which files are "not staged for commit" and "staged".

If you have created annotations, you will see the db.json in the "changes" section. To commit it to version control, first type:
`git add db.json`, then `git commit -m 'updated annotations'`. This will ensure that your new annotations are saved permanently on your machine.

The next step is to "push" those "commits" to the "master" repository kept on github's servers so the other team members will have access to them. To do this, type `git push origin master`. You should see the output indicate git uploading the new content to github.

### "Pulling" Down Others' Annotations Before a Sesssion
Before sitting down to create new annotations, it is a good idea to "pull" the changes others have made to the database so there are not conflicts.

### Possible Errors and Troubleshooting
#### There are changes on the remote when you try to push
#### There are incompatible changes in your local environment when you try to pull from master
#### A File Seems to have Disappeared

# Resources on IIIF
## Technical Specifications
[IIIF Image API](https://iiif.io/api/image/3.0/)

[IIIF Presentation API](https://iiif.io/api/presentation/3.0/)

(There are also APIs for search and authentication. As well
## Presentations
["what is it"](https://www.youtube.com/watch?v=8LiNbf4ELZM) 

[Overview Presentation](https://www.youtube.com/watch?v=Z3ZgEv4p37o) 

[Presentation on the Image API](https://www.youtube.com/watch?v=1-8hT9YARiY) 

[Presentation on the Presentation API](https://www.youtube.com/watch?v=Ph2KQa-_ieM)

## Other Context
The current state of the Presentation API has been influenced by a years-long conversation about how to integrate multi-media into the same framework, so that the notion of a "canvas" has changed somewhat over the years.

# Resources on Git
[Video Tutorial Walkthrough of Common Git Tasks (for reference)](https://www.youtube.com/watch?v=SWYqp7iY_Tc) 

[Textual Presentation of Common Git Tasks](https://gist.github.com/jedmao/5053440#status) 

[Technical Manual for Git](https://git-scm.com/book/en/v2)
