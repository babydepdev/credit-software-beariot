import React, { useEffect, useState } from 'react'
import { LindePackageItem } from './utils/LindePackageItem'
import { IoTDesignPackageItem } from './utils/IoTDesignPackageItem'
const App = () => {
  const [licenses, setLicenses] = useState([])
  const [openIndex, setOpenIndex] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const fetchPromises = IoTDesignPackageItem.map(async (item) => {
        const response = await fetch(item.licenseApiUrl, {
          headers: {
            'Authorization': 'Bearer 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'
          }
        })
        const data = await response.json()

        if (data.content) {
          const decodedContent = atob(data.content)
          return {
            title: item.title,
            version: item.version,
            licenseContent: decodedContent,
            repoUrl: item.repositoryUrl,
            data: data,
          }
        } else {
          return {
            title: item.title,
            version: item.version,
            licenseContent: "No license content available",
            repoUrl: item.repositoryUrl,
          }
        }
      })

      const results = await Promise.all(fetchPromises)
      results.sort((a, b) => a.title.localeCompare(b.title))

      setLicenses(results)
    } catch (error) {
      console.error("Error fetching license:", error)
    }
  }

  const toggleLicense = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }
  return (
    <div className='p-4'>
      <h1 className='text-2xl mb-4'>Package Licenses</h1>
      <div className='space-y-4'>
        {licenses.map((item, index) => (
          <div key={index} className='bg-[#E8F0FE] w-full p-1 rounded-md'>
            <div className='flex w-full justify-between'>
              <h2 className='text-lg'>{item.title} - {item.version}</h2>
              <div className='space-x-2'>
                <button
                  className='underline text-blue-600'
                  onClick={() => toggleLicense(index)}
                >
                  {openIndex === index ? 'Hide License' : 'Show License'}
                </button>
                <a href={item.repoUrl} target='_blank' rel='noreferrer'>
                  <button className='underline text-blue-600'>Homepage</button>
                </a>
              </div>
            </div>
            {openIndex === index && (
              <div className='mt-2'>
                <pre className='whitespace-pre-wrap text-sm'>{item.licenseContent}</pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default App