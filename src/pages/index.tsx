import * as React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import { StaticImage, GatsbyImage } from "gatsby-plugin-image"

import Layout from "../components/layout"
import Seo from "../components/seo"

interface IIndexPageProps {}

const IndexPage = props => {
  const data = useStaticQuery(graphql`
    query HeaderQuery {
      allLettersXlsxSheet1 {
        edges {
          node {
            letter
            value
          }
        }
      }
      allLettersXlsxSheet2 {
        edges {
          node {
            letter
            value
          }
        }
      }
      allKapsleVersion1XlsbXlsxArkusz1 {
        edges {
          node {
            Firma
            Miasto
            Nazwa
            Opis_na_zabkach_
            Panstwo
            Zdjecie
            id
          }
        }
      }
      allAirtable {
        edges {
          node {
            data {
              Firma
              Miasto
              Nazwa
              Nazwa_Piwa
              Panstwo
              Zdjecie {
                thumbnails {
                  large {
                    url
                  }
                }
              }
            }
          }
        }
      }
    }
  `)

  console.log(data)

  const data1 = data.allLettersXlsxSheet1.edges
  const data2 = data.allLettersXlsxSheet2.edges
  const capsleData = data.allKapsleVersion1XlsbXlsxArkusz1.edges
  const airTable = data.allAirtable.edges

  console.log(airTable)

  console.log()
  return (
    <Layout>
      <div>
        <table>
          <thead>
            <tr>
              <th>Sheet1</th>
            </tr>
            <tr>
              <th>Letter</th>
              <th>ASCII Value</th>
            </tr>
          </thead>
          <tbody>
            {airTable.map((row, i) => (
              <tr key={`${row.node.value} ${i}`}>
                <td>{i}</td>
                <td>{row.node.data.Firma}</td>
                <td>{row.node.data.Miasto}</td>
                <td>{row.node.data.Nazwa}</td>
                <img
                  src={
                    row.node.data.Zdjecie
                      ? row.node.data.Zdjecie[0].thumbnails.large.url
                      : ""
                  }
                  alt="A cap image"
                />
              </tr>
            ))}
          </tbody>
        </table>
        <div></div>
      </div>
    </Layout>
  )
}

export default IndexPage
