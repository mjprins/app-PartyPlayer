<!--
This file is part of webinos platform.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

(C) Copyright 2012, TNO

Author Victor Klos
-->

## Project home of the webinos PartyPlayer demo

The layout of this project folder is as follows:

        |
        +-- apps                       -> apps, both host and guest
        |
        +-- docs                       -> documentation, incl generated figures
        |
        +-- library                    -> content
        |
        +-- README.md                  -> this file

### Installing

The PartyPlayer depends on the webinos platform, in particular the App2App API. For now the PartyPlayer is made part of the webinos testbed application. To use PartyPlayer first install the webinos platform then install PartyPlayer in *<WEBINOS_PLATORM>/webinos/web_root*.

### Running

The PartyPlayer consists of two parts, that both must be opened in a recent version of firefox, safari, chrome or chromium:

1. Party **Host** front-end at `http://localhost:8080/apps/host/index.html`. Use a single instance.
2. Party **Guest** front-end at `http://localhost:8080/apps/guest/index.html`. Use as many as you like.

Check out [jira for AppParty](http://jira.webinos.org/browse/APPPARTY) for a complete overview of the product backlog, plans for new features or for issueing bugs.

For details on the implementation please refer to the docs.

### Usage

The Host app is supposed to run large, on a TV screen for example. It plays the media, shows upcoming songs, displays chats and invites people at the party to join in the interactive experience.

Each guest runs a guest app. Using the app you can share your own music collection with 'Add local items'. Doing so will extend the Collection that is seen by everyone, visually too. Other guests can then proceed to actually 'Add' the content. Note that this scheme requires you to convince others that your shared music should be played!

All music that has been added this way is moved to the funnel. This is where the interaction takes place. Think of simply upvoting your favourites, but also of playing mini games to gain power...

### Documentation

Building the documentation requires [PlantUML](http://plantuml.sourceforge.net/), [jsdoc-toolkit](https://code.google.com/p/jsdoc-toolkit/) and [markdown](http://daringfireball.net/projects/markdown/).

#### Building documentation on OSX

1. Download and install [PlantUML](http://plantuml.sourceforge.net/)
2. Create a script to execute PlantUML and add it to your path. Or you can use [this example script](https://gist.github.com/4502562)
3. Install jsdoc-toolkit using [Homebrew](http://mxcl.github.com/homebrew/): *brew install jsdoc-toolkit*
4. Install markdown using [Homebrew](http://mxcl.github.com/homebrew/): *brew install markdown*

Good luck!

### Acknowledgements

Icons located in apps/guest/icons/icons.js were downloaded from the [Icon Archive](http://www.iconarchive.com/).

