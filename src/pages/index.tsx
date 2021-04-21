import React from 'react'
import { graphql } from 'gatsby'
import Grid from '../components/grid'
import SEO from '../components/seo'
import Header from '../components/header'
import Footer from '../components/footer'
import Container from '../components/container'
import { extractRepositories, QueryData } from '../data/github'
import { useMixpanel } from 'gatsby-plugin-mixpanel'
import { SUBSCRIBED, GITHUB_CLICKS, GITPOD_CLICKS, campaignParams } from '../mixpanel'

const App = (props: { data: QueryData }) => {
  const [repositories, setRepositories] = React.useState(
    // first render pass must match static file or Gatsby gets confused
    // filtering is dynamic and happens after page load
    extractRepositories(props.data, { filtered: false })
  )

  const mixpanel = useMixpanel()

  // run effect after JS initializes to apply filter, passing empty array as
  // second argument to ensure this only runs once
  React.useEffect(() => {
    setRepositories(
      extractRepositories(props.data, { filtered: true })
    )
    // mixpanel setting part
    mixpanel.register({'timestamp': new Date().toString()})

    mixpanel.track_links("a", "Link Click Examples", {'timestamp': new Date().toString()})

    const id = mixpanel.get_distinct_id()
    mixpanel.identify(id)
    mixpanel.people.set({
      [SUBSCRIBED]: false, 
      [GITPOD_CLICKS]: 0, 
      [GITHUB_CLICKS]: 0})
    mixpanel.people.set_once("First time touch examples", new Date().toString() )
    campaignParams(mixpanel)
  }, [])



  return (
    <>
      <SEO />
      <div style={{ minHeight: '100vh' }}>
        <Header>
          <h1 style={{ marginBottom: 0 }}>Examples</h1>
          <p style={{ marginTop: 0 }}>
            Wondering what you can build with <a href="https://near.org/">NEAR</a>? Check out these examples for inspiration! You can also <a href="https://github.com/near-examples">view these examples on GitHub</a>.
          </p>
        </Header>
        <Container>
          <Grid repositories={repositories} />
        </Container>
      </div>
      <Footer />
    </>
  )
}

export default App

export const query = graphql`
  query {
    github {
      search(type: REPOSITORY, first: 20, query: "org:near-examples topic:ready-to-use") {
        repositoryCount
        pageInfo {
          hasNextPage
          endCursor
        }
        repositories: nodes {
          ... on GitHub_Repository {
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
    }
  }
`