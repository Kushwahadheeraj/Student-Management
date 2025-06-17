import Hero from '../assets/first.jpeg';
import About from './About';
import StatsOverview from './StatsOverview';
function Home() {
  return (
    <div className=''>
      <img className='w-full ' src={Hero} alt='hero' />
      <About />
      <StatsOverview />
    </div>
  );
}
export default Home;
