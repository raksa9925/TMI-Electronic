import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTelegram } from '@fortawesome/free-brands-svg-icons';
import { faPhone } from '@fortawesome/free-solid-svg-icons';

const AboutUs = () => {
  return (
    <main className="p-6 bg-gray-50 dark:bg-gray-900 text-gray-800 font-sans antialiased">
      <section className="pt-[70px] max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 bg-white shadow-lg rounded-lg overflow-hidden">

        {/* LEFT CONTENT */}
        <div className="lg:w-1/2 p-8 flex flex-col justify-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-6">
            Contact Us
          </h1>     

          <a href="#" className="text-blue-600 p-2">
            <FontAwesomeIcon icon={faFacebook} size="2x" />
            <span className='text-black ml-[10px] mt-[-10px] '>TMI Electronic solution</span>
          </a>

          <a href="#" className="text-blue-400 p-2">
            <FontAwesomeIcon icon={faTelegram} size="2x" />
            <span className='ml-[10px] text-black'>012 395 399</span>
          </a>

          <div className=" text-black p-4">
            <FontAwesomeIcon icon={faPhone} size="lg" />
            <span className='ml-[20px]'>093 395 399</span>
          </div>
        </div>

        {/* MAP */}
        <div className="lg:w-1/2 p-8">
          <h2 className="text-2xl font-bold mb-4">Find Us</h2>

          <div className="h-96 w-full rounded-lg overflow-hidden shadow-lg">
            <iframe
              title="TMI Electronic Store Location"
              src="https://maps.google.com/maps?q=714,%20TMI%20electronics%20stores,%2012154%20Street%20128,%20Phnom%20Penh&z=14&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutUs;
