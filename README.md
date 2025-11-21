<div align="center">
  <a href="https://github.com/daniel-samson/cryptobro">
    <img src="design/cryptobro-logo-v1.svg" alt="Logo" width="328" height="88">
  </a>
  <p>
    <strong>A web application that displays information about the latest cryptocurrency prices.</strong>
  </p>
</div>

## Structure

This is as mono repo, comprised of a front-end and backend applications.

### Front-end Application

The front end application is a Nuxt application. Which communicates to the backend application via its REST API.

#### Features

- [Tailwind CSS](https://tailwindcss.com)
- [Shadcn Vue](https://www.shadcn-vue.com)


### Backend application

The backend application is stock laravel application. It provides a REST API to the front-end applition. It uses [coingecko](https://docs.coingecko.com/v3.0.1/reference/endpoint-overview) api to provide the latest cryptocurrency prices.
