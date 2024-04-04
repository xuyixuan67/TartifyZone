import React, { useState, useEffect} from 'react';
import { Loader, Card, FormField } from '../components';

// functional components 
//to render different cards with data and titles
const RenderCards = ({data, title}) =>{
  if(data?.length > 0){
    return data.map(
      (post) => <Card key={post._id} {...post}/>
    )
  }

  return(
    <h2 className='mt-5 font-bold text-[#4170f1]
    text-xl uppercase'>{title}</h2>
  )
}

const Home = () => {

  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [seartchResults, setSearchResults] = useState(null);
  const [searchTimeout, setSearchTimeout] = useState(null);

  //need to add a fetchPosts function so all the img will show
  useEffect(()=>{
    const fetchPosts = async () => {
      setLoading(true);
      try{
        const response = await fetch('http://localhost:8000/api/post',
        {
          method: 'GET',
          headers: {
            'Content-Type' : 'application/json'
          },
        })

        if(response.ok){
          console.log(response);
          const result = await response.json();
          console.log(result)
          setAllPosts(result.data.reverse());
        }

      }catch(err){
        alert(err);
      }finally{
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);


  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);

    setSearchText(e.target.value);

    setSearchTimeout(

    setTimeout( () => {
      const searchResults = allPosts.filter((item) => item.name.toLowerCase().includes(searchText.toLocaleLowerCase())
      || item.prompt.toLowerCase().includes(searchText.toLocaleLowerCase()) );
      
      setSearchResults(searchResults);
    }, 500)
    );
    
  }

  return (
    <section className='max-w-7xl mx-auto'>
      <div>
      <h1 className='font-extrabold
      text-[#23304c] text-[32px]'>
        The Community Showcase</h1>
        <p className='mt-2 text-[#5870a3]
        text-[16px] max-w[500px]'>Embark on a 
        journey through a captivating array of 
        imaginative and visually striking images 
        crafted by the innovative DALE-E AI.</p>
      </div>
      
      <div className='mt-16'>
        <FormField
        labelName="Search posts"
        type="text"
        name="text"
        placeholder="Search posts"
        value={searchText}
        handleChange={handleSearchChange}
      /></div>

      <div className='mt-10'>
        { loading ? 
        (<div className='flex justify-center
        items-center'><Loader/></div>) : 
        (
          <>
            {searchText && (
              <h2 className='font-medium
              text-[#5870a3] text-xl mb-3'>
                Showing results for  
                <span className='text-[#23304c] ml-1'>
                  {searchText}
                </span>
              </h2>
            )}
            <div className='grid lg:grid-cols-4 sm:grid-cols-3
            xs:grid-cols-2 grid-cols-1 gap-3'>
                  {searchText ? (
                    <RenderCards 
                      data={seartchResults}
                      title="No search results found" />
                  ) : (
                    <RenderCards 
                      data={allPosts}
                      title="No posts found"/>
                  )}  
            </div>
          </>
        )

        }
        

      </div>
    </section>
  )
}

export default Home