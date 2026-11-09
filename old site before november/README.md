# Vesselina Belcheva — Portfolio

Static portfolio website prepared for GitHub and Netlify.

## Structure

- `index.html` — the complete website
- `assets/` — images, video posters, videos and favicon
- `netlify.toml` — tells Netlify to publish the repository root

## Updating

Keep filenames lowercase and avoid spaces. Replace or add files in `assets/`, update their paths in `index.html`, then commit the changes to GitHub. Netlify will publish the new version automatically when the repository is connected.

### Replacing the personal introduction video

Export the new version as a 16:9 MP4 (1280×720 is ideal and under 25 MB is easiest for GitHub), name it `personal-intro.mp4`, and replace the file with that name inside `assets/`. Replace `personal-intro-poster.jpg` too if you want a new preview frame. Because the filenames stay the same, no HTML edit is needed.
