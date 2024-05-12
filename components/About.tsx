"use client"

export default function About() {
    return (
        <section id="about" className="scroll-mt-16">
             <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-background/0 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
        <h2 className="text-sm font-bold uppercase tracking-widest lg:sr-only">
          About
        </h2>
      </div>
      <div className="flex flex-col gap-4">
        <p className="text-start text-muted-foreground lg:px-6">
        As a Junior at the <span className="no-wrap text-primary dark:text-white"> Indian Institute of Information Technology-Bhagalpur</span>, currently pursuing a B.Tech in <span className="no-wrap text-primary dark:text-white"> Computer Science and Engineering</span>, my journey into the tech world began early on. Born to a father deeply entrenched in technology, I was practically raised on computers. This environment fueled my curiosity, leading me to officially kickstart my technical journey at around 16 years old, mastering the art of writing basic code, including the iconic &quot;<span className="no-wrap text-primary dark:text-white">Hello World</span>&quot; in C.
        </p>
        <p className="text-start text-muted-foreground lg:px-6">
        Oh, the grandeur of it all! Embarking on my technical odyssey, I marveled at the complexity of printing &quot;Hello World&quot; in C. Who needs Shakespeare when you&apos;ve got this timeless masterpiece echoing through the command line? Since then, I&apos;ve traversed a path of continuous learning and exploration, understanding that development is more than just a code—it&apos;s a harmonious blend of practice, discipline, and unwavering dedication to core principles.   
        </p>
        <p className="text-start text-muted-foreground lg:px-6">
            Outside of work, I&#39;m an avid reader, an amateur writer, can say appreciate good literature. I try to keep myself updated with the latest trends in technology and I am always looking for new opportunities to learn and grow. Looking forward, Just trying to feel the essence of what it means <span className="no-wrap text-primary dark:text-white">to be engineer</span>.
        </p>
      </div>
        </section>
    );
}