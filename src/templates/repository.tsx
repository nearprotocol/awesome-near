import React from 'react'
import Markdown from 'react-markdown'
import { graphql } from 'gatsby'
import { RepositoryTypeRaw, shape } from '../data/github'
import Header from '../components/header'
import Footer from '../components/footer'
import SEO from '../components/seo'
import Gitpod from './gitpod'
import GitHub from './github'

import { useMixpanel } from 'gatsby-plugin-mixpanel'
import { GITHUB_CLICKS, GITPOD_CLICKS } from '../mixpanel'


// bypass typescript by using commonjs syntax:
// https://github.com/microsoft/TypeScript-React-Starter/issues/12
const defaultBanner = require('../images/default-banner.svg')

type Props = {
  data: {
    github: {
      repo: RepositoryTypeRaw
    }
  }
}

const Repository = ({ data }: Props) => {
  const repo = shape(data.github.repo)
  const readme = repo.readme.replace(/[\s\S]*<!-- [^>]+ -->/, '')
  const image = repo.usesCustomOpenGraphImage
    ? repo.openGraphImageUrl
    : defaultBanner

  // mixpanel tracking part
  const mixpanel = useMixpanel()
  
  const trackGitpod = () => {
    mixpanel.people.increment([GITPOD_CLICKS])
    mixpanel.track("Click Gitpod button")
  }

  const trackGithub = () => {
    mixpanel.people.increment([GITHUB_CLICKS])
    mixpanel.track("Click Github button")
  }

  React.useEffect(
    () => {
      const id = mixpanel.get_distinct_id()
      mixpanel.identify(id)
      mixpanel.track_links("a", "Link Click Examples", {'timestamp': new Date().toString()})
      mixpanel.track("View page", {pathname: window.location.pathname})

    }
  , [])

  return (
    <>
      <SEO
        title={'NEAR Example: ' + repo.headline}
        description={repo.description + ' – An example showing the sort of thing you can build with NEAR Protocol'}
        meta={[
          {
            name: 'twitter:card',
            content: 'summary_large_image'
          },
          {
            property: 'og:image',
            content: image
          },
          {
            property: 'og:url',
            content: `https://examples.near.org/${repo.name}/`
          }
        ]}
      />
      <Header>
        <h1>{repo.headline}</h1>
      </Header>
      <div style={{
        padding: '1em',
        margin: '0 auto',
        maxWidth: '45em'
      }}>
        <img alt="" src={image} />
        <p style={{
          display: 'grid',
          gridGap: '1.5em',
          gridTemplateColumns: 'repeat(auto-fit, minmax(17em, 1fr))',
          alignItems: 'center',
          margin: '1.5em 0'
        }}>
          <a className="button" href={`https://gitpod.io/#${repo.url}`} onClick={trackGitpod}>
            <span>Open in</span>
            <Gitpod />
          </a>
          <a className="button" href={repo.url} onClick={trackGithub}>
            <span>Browse on</span>
            <GitHub />
          </a>
        </p>
        <Markdown source={readme} />
      </div>
      <Footer />
    </>
  )
}

export default Repository

export const query = graphql`
  query($name: String!) {
    github {
      repo: repository(name: $name, owner: "near-examples") {
        id
        name
        description
        url
        openGraphImageUrl
        usesCustomOpenGraphImage
        readme: object(expression: "master:README.md") {
          ... on GitHub_Blob {
            text
          }
        }
        repositoryTopics(first: 10) {
          nodes {
            id
            url
            topic {
              id
              name
            }
          }
        }
      }
    }
  }
`
