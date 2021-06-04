import * as React from "react"
import { Link, useStaticQuery, graphql } from "gatsby"
import { StaticImage, GatsbyImage } from "gatsby-plugin-image"
import { useState, useEffect } from "react"
import axios from "axios"

import Layout from "../components/layout"
import Seo from "../components/seo"

interface IIndexPageProps {}

interface ICountry {
  name: string
  selected: boolean
}

const IndexPage = props => {
  const [company, setCompany] = useState<string>("")
  const [countries, setCountries] = useState<ICountry[]>([{name:"Albania", selected: false}, {name:"Abchazja", selected: false}])
  const [results, setResults] = useState<any>();
  const [rebuildInfo, seRebuildInfo] = useState<boolean>(false);
  const data = useStaticQuery(graphql`
    query HeaderQuery {
      allAirtable {
        edges {
          node {
            data {
              Firma
              Miasto
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


  const updateCheckboxChange = index => e => {
    let newArr = [...countries];
    newArr[index] = {name: countries[index].name, selected: e.target.checked};
    setCountries(newArr);
  }

  const airTable = data.allAirtable.edges

  const filterTable = () => {
    let albaniaArrayArray = airTable.filter(c => (c.node.data.Panstwo && countries[0].selected && c.node.data.Panstwo.includes(countries[0].name)))
    let abchazjaArray = airTable.filter(c => (c.node.data.Panstwo && countries[1].selected && c.node.data.Panstwo.includes(countries[1].name)))

    let countriesArray = [...albaniaArrayArray, ...abchazjaArray]

    if(countriesArray.length === 0)
    {
      const companyArray = airTable.filter(c => (c.node.data.Firma && c.node.data.Firma.includes(company)))
      setResults(companyArray);
    }
    else {
      const companyArray = countriesArray.filter(c => (c.node.data.Firma && c.node.data.Firma.includes(company)))
      setResults(companyArray);
    }
 
   // let lastArray = [...new Set(resultArray)];
  }


  useEffect(() => {
    setResults(data.allAirtable.edges);
   // console.log(results)
    filterTable ();
  }, [company, countries])
  
  const requestOptions = {
    method: 'POST',
    headers: {
      'Accept' : 'application/vnd.github.v3+json', 
      'User-Agent' : 'Contentful Webhook',
      'Authorization' :'Bearer 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'
    },
    body: JSON.stringify({ event_type: 'page.rebuild' })
  }

  async function submitHandler() {
    const response = await fetch("https://api.github.com/repos/MateuszSzostek/cap-test/dispatches",requestOptions);
    const data = await response.json();
    console.log(data)
  }


  return (
    <Layout>
      <div style={{display: "flex", flexDirection: "column"}}>
        <div>
           <label htmlFor="name">Nazwa Firmy</label>
        <input
          onChange={a => a.target.value !== "" ? setCompany(a.target.value) : setCompany("")}
          type="text"
          name="name"
        ></input>
        </div>
       
    <div>
      <input onChange = {updateCheckboxChange(0)} type="checkbox" id="Albania" name="Albania" value="Albania"></input>
      <label htmlFor="Albania"> Albania</label><br></br>
    </div>

    <div>
      <input onChange = {updateCheckboxChange(1)} type="checkbox" id="Abchazja" name="Abchazja" value="Abchazja"></input>
      <label htmlFor="Abchazja"> Abchazja</label><br></br>
    </div>
    <button style={{width: "200px"}} onClick = {() => submitHandler()}>Przebuduj Stronę</button>
    <div>{rebuildInfo && "Strona zostanie przebudowana. Odśwież strone po kilku minutach aby sprawdzić czy zostały wprowadzone zmiany"}</div>

      </div>
      <div>
        <table>
          <thead>
            <tr>
              <th>Sheet1</th>
            </tr>
            <tr>
              <th>Id</th>
              <th>Panstwo</th>
              <th>Miasto</th>
              <th>Firma</th>
            </tr>
          </thead>
          <tbody>
            {results && results.map((row, i) =>     
           // (row.node.data.Firma && row.node.data.Firma.includes(company) &&
            //((row.node.data.Panstwo && countries.map(c => row.node.data.Panstwo.includes(c.name))) &&  
             <tr key={`${row.node.value} ${i}`}>
                  <td>{i}</td>
                  <td>{row.node.data.Panstwo ? row.node.data.Panstwo : "-"}</td>
                  <td>{row.node.data.Miasto ? row.node.data.Miasto : "-"}</td>
                  <td>{(row.node.data.Firma)}</td>
                  <td><img
                    src={
                      row.node.data.Zdjecie
                        ? row.node.data.Zdjecie[0].thumbnails.large.url
                        : ""
                    }
                    alt="A cap image"
                  /></td>
 
                </tr>) 

            }
          </tbody>
        </table>
        <div></div>
      </div>
    </Layout>
  )
}

export default IndexPage
