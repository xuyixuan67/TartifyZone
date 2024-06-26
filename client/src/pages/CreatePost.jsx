import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { preview } from '../assets';
import { getRandomPrompt } from '../utils';
import { FormField, Loader } from '../components';

const CreatePost = () => {

  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    prompt: '',
    photo: '',
  });

  const [generatingImg, setGeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false);


const generateImage = async () => {
  // Call to backend
  if (form.prompt) {
      try {
          setGeneratingImg(true);

          const res = await fetch(
            'http://localhost:8000/api/generateImg', 
            {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ prompt: form.prompt }),
          });

          const data = await res.json();  
          console.log(data);       
          setForm({ ...form, photo: `data:image/jpeg;base64,${data.photo}`});
          
      } catch (error) {

          console.error('Error:', error); // Log the error for debugging
          alert('An error occurred while generating the image. Please try again later.');

      } finally {
          setGeneratingImg(false);
      }
  } else {
      alert('Please enter a prompt');
  }
};


  const handleSubmit = async(e) => {
    e.preventDefault();

    if(form.prompt && form.photo){
      setLoading(true);
   
      try{
        const response = await fetch(
          'http://localhost:8000/api/post',{
          method: 'POST',
          headers: {
            'Content-Type' : 'application/json'
          },
          body: JSON.stringify(form)
        })

        await response.json();
        navigate('/');

      }catch(err){

        alert(err);
        console.error(err);
      
      }finally{
        setLoading(false);
      }

    }else{
      alert('Please enter a prompt and generate an image')
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value})
  }
  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt);
    setForm({ ...form, prompt: randomPrompt})
  }

  return (
    <section className='max-w-7xl mx-auto'>
      <div>
      <h1 className='font-extrabold
      text-[#23304c] text-[32px]'>
        Create</h1>
        <p className='mt-2 text-[#5870a3]
        text-[16px] max-w[500px]'>Embark on a 
        journey of creating imaginative and visually 
        striking images using the innovative DALE-E AI 
        and share them with the community.</p>
      </div>

      <form className='mt-16 max-w-3x1' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-5'>
          <FormField
            labelName="Your name" type="text" name="name" 
            placeholder="John Doe" value={form.name}
            handleChange={handleChange}
          />
          <FormField
            labelName="Prompt" type="text" name="prompt" 
            placeholder="A surreal underwater cityscape with neon-lit jellyfish floating among skyscrapers." 
            value={form.prompt}
            handleChange={handleChange}
            isSurpriseMe
            handleSurpriseMe={handleSurpriseMe}
          />

          <div className="relative bg-gray-50 border border-gray-300
          text-gray-900 text-sm rounded-lg focus:ring-blue-500
          focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center" >
             {form.photo ? 
             (<img src={form.photo} alt={form.prompt} 
              className="w-full h-full object-contain" />)
             :
             (<img src={preview} alt="preview" 
             className="w-9/12 h-9/12 object-contain opacity-40" />)} 

             {generatingImg && (
              <div className="absolute inset-0 z-0 flex
              justify-center items-center bg-[rgba(0,0,0,0.5)]
              rounded-lg">
                <Loader />
              </div>
             )}
          </div>
        </div>

        <div className="mt-5 flex gap-5">
              <button type="button" onClick={generateImage}
              className="text-white bg-orange-400 font-medium
              rounded-md text-sm w-full sm:w-auto px-5 py-2.5">
                {generatingImg ? 'Generating...' : 'Generate'}
              </button>
        </div>

        <div className="mt-10">
          <p className="mt-2 text-[#666e75] text-[14px]">
              You have created the image you want, you can share it with others in the community.
          </p>
          <button type="submit"
          className="mt-3 text-white bg-[#4170f1]
          font-medium rounded-md text-sm w-full sm:w-auto
          px-5 py-2.5 text-center">
            {loading? 'Sharing...' : 'Share with the community' }
            </button>    
        </div>
      </form>
    </section>
  )
}

export default CreatePost