import { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'  // Import useRouter hook for routing
import '../styles/globals.css'
import Header from '../components/header';

export default function Home() {
  const [developers, setDevelopers] = useState([])
  const [issues, setIssues] = useState([])

  const router = useRouter()  // Use the router hook to enable routing

  // Fetch developers on page load
  useEffect(() => {
    async function fetchDevelopers() {
      const res = await axios.get('http://127.0.0.1:8000/developer')  // Adjust the backend URL if necessary
      setDevelopers(res.data)
    }
    fetchDevelopers()
  }, [])

  useEffect(() => {
    async function fetchIssues() {
      const res = await axios.get('http://127.0.0.1:8000/issues')  // Adjust the backend URL if necessary
      setIssues(res.data)
    }
    fetchIssues()
  }, [])

  // Handle redirect to the Add New Developer page
  const handleAdd = () => {
    router.push('/add')  // Redirect to the addNewDeveloper page
  }

  const handleAddIssue = () => {
    router.push('/addIssue')  // Redirect to the addNewDeveloper page
  }

  const handleGetRecommendation = () => {
    router.push('/issues')  // Redirect to the addNewDeveloper page
  }


  return (
      <div className="content">
        <Header />
    
        {/* Bold Title (White) */}
        <h1 className="white-bold-title">A.I.M: A.I. Integrated Project Management</h1>

        <h2 className='black-title'>A.I.M Bot leverages cutting-edge AI to simplify and supercharge project management. 
        From generating Jira tickets to optimizing task allocation and long-term planning, 
        our tool reduces manual effort and improves team productivity. </h2>
    
        {/* Regular Title (Black) */}
        <h2 className="white-title">How can we assist you?</h2>
    

        <div className='button-container'>
          <button onClick={handleAdd} className='button'>Add New Developer</button>
          <button onClick={handleAddIssue} className='button'>Add New Project</button>
          <button onClick={handleGetRecommendation} className='button'>Get Recommendations</button>
        </div>
        
        {/*<button class = ''> onClick = {handle}</button>*/}

        <div className="text-content">
          {/* <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tristique consequat eros, eget tempus augue venenatis ac. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Proin aliquam, lectus sit amet vestibulum scelerisque, velit odio suscipit nunc, nec interdum odio felis at justo.</p>

          <p>Curabitur nec risus turpis. In hac habitasse platea dictumst. Donec aliquet, est id tristique sagittis, nunc nisi consectetur turpis, non suscipit libero quam et nisi. Sed at luctus mauris, sit amet pharetra ipsum. Maecenas sodales turpis eu odio facilisis, nec pharetra augue pellentesque.</p>

          <p>Vestibulum nec elementum risus. Aenean feugiat nulla ac odio dapibus, nec cursus eros ullamcorper. Donec euismod lorem non elit pharetra, in rhoncus magna gravida. Nullam ut sem in metus pharetra faucibus. Duis imperdiet tortor eu elit tincidunt, non gravida erat euismod.</p>

          <p>Phasellus auctor velit in ligula fermentum, eget dictum justo elementum. Nullam malesuada fringilla erat, nec tincidunt justo faucibus vel. Suspendisse potenti. Etiam hendrerit enim at justo scelerisque, ut vulputate odio pellentesque. Integer vel tincidunt ex, ac tincidunt ligula. Aenean nec ligula turpis. Nulla facilisi.</p>

          <p>Ut vestibulum lectus id nulla convallis, a scelerisque est ornare. Sed varius consectetur augue ut fermentum. Nullam malesuada, libero non dictum gravida, est augue euismod elit, id tempor nisi orci eu justo. In convallis lacus nec nunc varius, eget consectetur nunc sagittis.</p>

          <p>Nam consequat, magna id tincidunt volutpat, urna erat laoreet urna, ut suscipit ligula nulla id nunc. Integer in tincidunt magna, sit amet efficitur lacus. Pellentesque volutpat risus vitae odio sagittis bibendum. Curabitur at nulla in libero fermentum dapibus sit amet eget urna.</p>

          <p>Mauris tincidunt diam nec venenatis elementum. Cras non orci ut leo vehicula tincidunt. Etiam hendrerit, nunc nec fermentum vulputate, odio odio fringilla libero, eget commodo libero purus vel felis. Suspendisse at libero convallis, auctor elit ac, lacinia erat.</p>

          <p>Suspendisse potenti. Integer vehicula risus vitae magna facilisis fringilla. Donec consequat mauris nec dui viverra, sed tempor purus volutpat. Morbi hendrerit ligula eget eros tincidunt, in posuere erat egestas. Cras at sapien quis magna dapibus vehicula.</p>

          <p>Fusce pharetra ligula sit amet lacus congue, eget venenatis eros lobortis. Nam lacinia, odio vel tincidunt congue, arcu odio ullamcorper magna, sit amet sodales odio augue id felis. Integer vehicula risus vitae magna facilisis fringilla. Suspendisse eu efficitur magna.</p>

          <p>Aliquam erat volutpat. Etiam dapibus, libero at scelerisque vestibulum, nisi lorem suscipit augue, ut imperdiet libero risus nec purus. Sed ac tortor vel odio ullamcorper scelerisque nec ut ligula. Nam ut justo risus. Nulla facilisi. In hac habitasse platea dictumst.</p>

          <p>Phasellus fringilla nulla non velit vestibulum, a hendrerit elit vehicula. Proin maximus, turpis nec gravida iaculis, metus nisl faucibus orci, et molestie eros sapien non sapien. Nam sit amet feugiat lorem, eget convallis turpis. Etiam in metus ut risus gravida dictum.</p>

          <p>Donec non tincidunt elit, eget malesuada sapien. Nam cursus tincidunt magna, sit amet vulputate libero laoreet et. Ut convallis sodales felis, eget rhoncus risus tincidunt nec. Sed congue tincidunt turpis nec convallis.</p>

          <p>Aenean id augue at nisi dapibus vehicula. Quisque fringilla, lacus sed dapibus dictum, nulla velit suscipit erat, in dictum turpis lorem a justo. Mauris eu metus vitae purus tincidunt vehicula eget nec libero.</p>

          <p>Integer vitae justo felis. Ut eget dolor justo. Vestibulum interdum turpis ut hendrerit faucibus. Suspendisse id ligula a elit aliquet venenatis ac id neque. Cras convallis, libero eget egestas fermentum, lorem neque bibendum risus, non feugiat neque sapien nec ligula.</p>

          <p>Vivamus euismod vehicula urna non varius. Morbi auctor velit libero, at aliquet justo sagittis non. Nulla facilisi. Sed dapibus, justo nec scelerisque interdum, lectus sapien rhoncus magna, ut bibendum risus sapien id ligula.</p>

          <p>Fusce id quam eget enim volutpat fringilla. Pellentesque consequat est nec diam dignissim, ut venenatis erat ultricies. Integer eget justo mauris. Nullam nec libero id turpis vestibulum convallis. Aenean fermentum, justo non tincidunt aliquet, libero turpis dignissim nulla, ut congue ex est at ex.</p>

          <p>Etiam egestas urna eget malesuada vehicula. Phasellus condimentum tortor in augue gravida, at accumsan mauris laoreet. Vivamus at vestibulum quam. Donec fermentum felis in arcu scelerisque, ac dictum nulla elementum.</p>

          <p>Curabitur posuere ligula eget magna auctor, eu tristique ex bibendum. Vestibulum non felis ut orci tincidunt tincidunt. Nulla facilisi. Donec sit amet ligula elit.</p>

          <p>Vestibulum ac enim at nulla pellentesque sodales. Curabitur vestibulum facilisis quam non bibendum. Nulla facilisi. Suspendisse potenti.</p>
        
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tristique consequat eros, eget tempus augue venenatis ac. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Proin aliquam, lectus sit amet vestibulum scelerisque, velit odio suscipit nunc, nec interdum odio felis at justo.</p>

          <p>Curabitur nec risus turpis. In hac habitasse platea dictumst. Donec aliquet, est id tristique sagittis, nunc nisi consectetur turpis, non suscipit libero quam et nisi. Sed at luctus mauris, sit amet pharetra ipsum. Maecenas sodales turpis eu odio facilisis, nec pharetra augue pellentesque.</p>

          <p>Vestibulum nec elementum risus. Aenean feugiat nulla ac odio dapibus, nec cursus eros ullamcorper. Donec euismod lorem non elit pharetra, in rhoncus magna gravida. Nullam ut sem in metus pharetra faucibus. Duis imperdiet tortor eu elit tincidunt, non gravida erat euismod.</p>

          <p>Phasellus auctor velit in ligula fermentum, eget dictum justo elementum. Nullam malesuada fringilla erat, nec tincidunt justo faucibus vel. Suspendisse potenti. Etiam hendrerit enim at justo scelerisque, ut vulputate odio pellentesque. Integer vel tincidunt ex, ac tincidunt ligula. Aenean nec ligula turpis. Nulla facilisi.</p>

          <p>Ut vestibulum lectus id nulla convallis, a scelerisque est ornare. Sed varius consectetur augue ut fermentum. Nullam malesuada, libero non dictum gravida, est augue euismod elit, id tempor nisi orci eu justo. In convallis lacus nec nunc varius, eget consectetur nunc sagittis.</p>

          <p>Nam consequat, magna id tincidunt volutpat, urna erat laoreet urna, ut suscipit ligula nulla id nunc. Integer in tincidunt magna, sit amet efficitur lacus. Pellentesque volutpat risus vitae odio sagittis bibendum. Curabitur at nulla in libero fermentum dapibus sit amet eget urna.</p>

          <p>Mauris tincidunt diam nec venenatis elementum. Cras non orci ut leo vehicula tincidunt. Etiam hendrerit, nunc nec fermentum vulputate, odio odio fringilla libero, eget commodo libero purus vel felis. Suspendisse at libero convallis, auctor elit ac, lacinia erat.</p>

          <p>Suspendisse potenti. Integer vehicula risus vitae magna facilisis fringilla. Donec consequat mauris nec dui viverra, sed tempor purus volutpat. Morbi hendrerit ligula eget eros tincidunt, in posuere erat egestas. Cras at sapien quis magna dapibus vehicula.</p>

          <p>Fusce pharetra ligula sit amet lacus congue, eget venenatis eros lobortis. Nam lacinia, odio vel tincidunt congue, arcu odio ullamcorper magna, sit amet sodales odio augue id felis. Integer vehicula risus vitae magna facilisis fringilla. Suspendisse eu efficitur magna.</p>

          <p>Aliquam erat volutpat. Etiam dapibus, libero at scelerisque vestibulum, nisi lorem suscipit augue, ut imperdiet libero risus nec purus. Sed ac tortor vel odio ullamcorper scelerisque nec ut ligula. Nam ut justo risus. Nulla facilisi. In hac habitasse platea dictumst.</p>

          <p>Phasellus fringilla nulla non velit vestibulum, a hendrerit elit vehicula. Proin maximus, turpis nec gravida iaculis, metus nisl faucibus orci, et molestie eros sapien non sapien. Nam sit amet feugiat lorem, eget convallis turpis. Etiam in metus ut risus gravida dictum.</p>

          <p>Donec non tincidunt elit, eget malesuada sapien. Nam cursus tincidunt magna, sit amet vulputate libero laoreet et. Ut convallis sodales felis, eget rhoncus risus tincidunt nec. Sed congue tincidunt turpis nec convallis.</p>

          <p>Aenean id augue at nisi dapibus vehicula. Quisque fringilla, lacus sed dapibus dictum, nulla velit suscipit erat, in dictum turpis lorem a justo. Mauris eu metus vitae purus tincidunt vehicula eget nec libero.</p>

          <p>Integer vitae justo felis. Ut eget dolor justo. Vestibulum interdum turpis ut hendrerit faucibus. Suspendisse id ligula a elit aliquet venenatis ac id neque. Cras convallis, libero eget egestas fermentum, lorem neque bibendum risus, non feugiat neque sapien nec ligula.</p>

          <p>Vivamus euismod vehicula urna non varius. Morbi auctor velit libero, at aliquet justo sagittis non. Nulla facilisi. Sed dapibus, justo nec scelerisque interdum, lectus sapien rhoncus magna, ut bibendum risus sapien id ligula.</p>

          <p>Fusce id quam eget enim volutpat fringilla. Pellentesque consequat est nec diam dignissim, ut venenatis erat ultricies. Integer eget justo mauris. Nullam nec libero id turpis vestibulum convallis. Aenean fermentum, justo non tincidunt aliquet, libero turpis dignissim nulla, ut congue ex est at ex.</p>

          <p>Etiam egestas urna eget malesuada vehicula. Phasellus condimentum tortor in augue gravida, at accumsan mauris laoreet. Vivamus at vestibulum quam. Donec fermentum felis in arcu scelerisque, ac dictum nulla elementum.</p>

          <p>Curabitur posuere ligula eget magna auctor, eu tristique ex bibendum. Vestibulum non felis ut orci tincidunt tincidunt. Nulla facilisi. Donec sit amet ligula elit.</p> */}

        </div>
      </div>
    )
}
