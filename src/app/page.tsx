import Hero from '@/components/home/Hero';
import Featured from '@/components/home/Featured';
import Playground from '@/components/home/Playground';
import Archive from '@/components/home/Archive';
import About from '@/components/home/About';

export default function Home() {
    return (
        <main id="main-content">
            <Hero />
            <Featured />
            <Playground />
            <Archive />
            <About />
        </main>
    );
}
