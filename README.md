<img src="./design/notal_logo_banner.png" alt="logo" width="320"/>
<br/>

## PR's and code reviews are welcome!

### TODO: Put screenshots on README.md

### TODO: Switch Tooltip to Popper.js

# Notal

Notal is a simple platform to keep your management simple, as well as making it easy to work with multiple users on a workspace together. Currently a workspace consists from 4 main components: Board, Roadmap, Bookmarks and Changelog.

- Use board to keep your to-do lists organized
- Use roadmap to build a simple roadmap for your product. If you share this link with other users, they can upvote roadmaps so you can see which feature your users most wanted (Building - WIP)
- Use bookmarks to link board cards with bookmarks which you can add images and links (Building - WIP)
- Use changelog to view and edit your project's version notes (Building - WIP)

## Project features

- NextJS as primary framework, Vercel as primary host
- Authentication via Google and GitHub
- SWR, PWA, SSR & Workbox ready (see ./notal-root/worker/index.js for workbox development logs)
- SEO is correctly managed, used Workbox for superfast caching
- Uses Tailwind on frontend, `framer-motion` for cool animations, `next-themes` for Dark mode theme and `react-beautiful-dnd` for beatiful drag drop experience
- MongoDB on backend
- Secure session management using Firebase Auth
- Custom components made for Notal, each of them has different purpose and different styles with fully customisation option
- Comes with Google Material Icons
- Google Analytics for analytics, page views and page view times: LCP, TTFB and FCP

You can see a live demo at **https://notal.app**

## Running locally in development mode

To get started, just clone the repository and run `npm install && npm run devp` inside `notal-root` file:

    git clone https://github.com/erenkulaksiz/notal.git
    cd notal/notal-root
    npm install
    npm run devp

Opens development server on [https://localhost:3000](https://localhost:1111) with hot reload activated

Note: You can use `npm run dev` to start on port 3000. Make sure you have right port on .env.local aswell

## Building and deploying in production

If you wanted to run this site in production, you should install modules then build the site with `npm run build` and run it with `npm run start`:

    npm install
    npm run build
    npm run start

You should run `npm run build` again any time you make changes to the site

## Configuring

If you configure a .env.local file (just copy [.env.local.template](https://github.com/erenkulaksiz/notal/blob/master/.env.local.template) over to '.env.local' and fill in the options) you can configure a range of options

Make sure you have done oAuth options from Firebase console to get auth start to work

## Analyze bundle

Run `npm run analyze` to view bundle sizes for client and server

## Devnote

I've seen lately, many projects like:

- [anytype.io](https://anytype.io)
- [discourse.org](https://www.discourse.org)
- [linear.app](https://linear.app)
- [reflect.app](https://reflect.app)
- [height.app](https://height.app)

While first creating this project, i didn't yet know these projects. When i was this far, i found out about them. I suggest you to use them instead of Notal since this project is still being built.
Even while buying the domain, i didnt knew about them. It was a bit unlucky but now i have some competition going :)
