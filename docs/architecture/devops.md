# DevOps

<<<<<<< HEAD
Developing a project as important as Area requires a great DevOps structure to make sure our users are always using 
the latest features and improvements, while analyzing and testing automatically the whole project to make 
=======
Developing a project as important as Area requires a great DevOps to make sure our users are always using
the latest features and improvements, while analyzing and testing automatically the whole project to make
>>>>>>> 0be663c (docs: Fixing trailing spaces)
sure we reduce as much as possible the bugs & regressions introduced when the product evolves.\
Other majors points include releases & changelogs to keep an organized trace of the changes, and also providing
the best developer experience to ensure time is spent on things that matter.

All these things are present in Area and detailed on this page.

## Continuous Integration

Keeping the code clean and bug-free is one of our priorities. As such, we have implemented the following
checks, launched automatically on every code change (`commit`):

- [ESLint](https://eslint.org/) backend: Static code analysis to identify problematic patterns in the backend
- [ESLint](https://eslint.org/) web: Similar to the backend but for the React frontend
- Unit tests backend: Launching tests to make sure everything still works as expected, and uploading the
results on failure
- [Cypress](https://www.cypress.io/) tests web: Launching end-to-end tests on the web similar to the backend ones (screenshots and videos available
on failure)
- Mobile verifications: Checking if everything is formatted correctly, performing static analysis and running tests
- Web preview: Using Vercel to deploy the web frontend in development environments (excluding the `main` branch)
to simplify testing and cross-validation of features
- Documentation linting: Checking that all the files of this documentation (created in `markdown`) are correctly formatted
and follow the best practices.
- [SonarQube](https://www.sonarsource.com/products/sonarqube/): A tool used to perform continuous code inspections to help deliver Clean Code, detect security issues
and keep high standards to focus on code quality and maintainability. It runs on every push to `main` on a
self-hosted instance (with subdomain, `nginx` config and SSL certificate). It will also run the backend unit tests and
cypress web tests with coverage options to display it in the SonarQube dashboard.

## Continuous Deployment

Developing features is great, but ensuring users are always using the latest version is better!\
This is what we are implementing for this
- Push to the Epitech mirror: Make sure the original school project repository is always up-to-date on every branch
- Production deployment: Complete workflow to deploy the application on 2 instances (as explained in TODO): it stops the
current application, rebuild the necessary parts based on the changes (also applying database migrations) and restarting it all
- Secure and user-friendly access: The whole application is published on our own (sub)domain with the necessary DNS configurations.\
For this, we also have a custom `nginx` configuration to properly route the user requests to the underlying Docker container
(also taking care of the port forwarding as we have specific Docker ports to expose to respect the Epitech subject).\
Finally, we also issues auto-renewed SSL certificates for every domain we are using.
- Documentation deployment: This documentation is automatically rebuilt and deployed on every change on the `main` branch
using [GitHub Pages](https://pages.github.com/).
- Protobuf file updates: When there's a change in [our public protobuf repository](https://github.com/RezaRahemtola/area-proto),
we need to rebuild docker images in production (as the Docker cache won't detect changes in it's `git clone` steps).

## Releases

Deployment continuously is great, but we also need to group features and improvements in releases for more
stable deployments and project versioning.\
We are using a few tools to make this possible:
- [Release drafter](https://github.com/release-drafter/release-drafter): Creating draft releases automatically based on PRs merged on `main`
(the semantic version number and the type of change is detected with labels and a custom yaml config)
- Mobile APK build: GitHub releases already include a `.zip` file with the repository code, but being able to download
the APK for mobile usage directly from the release is better!\
That's exactly what this action does: building the APK on every release publication and adding it to its assets.
- [Changelog generation](https://github.com/rhysd/changelog-from-release): You maybe have seen [the CHANGELOG in this documentation](/CHANGELOG.md), which recaps all the
features, bugs fixes... made recently in the project. This file is actually automatically generated from the GitHub releases
when a new one is published!

## Environment variables

Managing environment variables can become quite a nightmare in a big project: multiple environments, multiple
teams, deployment instances or external tools (like a GitHub integration)...\
That's why we are using [Infisical](https://infisical.com/) to manage our secret variables, with the following custom configurations:
- Variables defined for multiple environments to simplify usage in development and secure production data
- Automatic injection of variables in development (especially backend and web) to keep them up to data between the team members
- Custom script to dump the environment in every part of the project with an specified environment (used for production deployments,
or for specific parts in development, like [workers](workers.md))
- Integrations with GitHub (secrets used for CI and CD runs) and Vercel (used for the web preview deployments)

## Miscellaneous

Other specific details about the technologies we are using:
- A [self-hosted GitHub Actions runner](https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/about-self-hosted-runners)
for some of our Action runs (like the Production deployment which can take
some time) as GitHub free-tier only includes 3000 minutes of workflows runs per month for private repositories (which is currently
the case) and we need way more than that for all our runs.
- Branch protection settings are also activated to avoid merges on the production branch if CI runs are not passing or if not
enough people have validated the changes.
