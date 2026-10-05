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
          Having graduated from the{" "}
          <span className="no-wrap text-primary dark:text-white">
            {" "}
            Indian Institute of Information Technology-Bhagalpur
          </span>
          , with a B.Tech in{" "}
          <span className="no-wrap text-primary dark:text-white">
            {" "}
            Computer Science and Engineering
          </span>
          , and my path into the technology sector started quite early. Since my
          father was deeply involved in technology, I was essentially brought up
          with computers. This surroundings sparked my curiosity and eventually
          led me to begin my technical studies when I was about 16 years old,
          learning how to write simple code, such as the well-known &quot;
          <span className="no-wrap text-primary dark:text-white">
            Hello World
          </span>
          &quot; program in C.
        </p>
        <p className="text-start text-muted-foreground lg:px-6">
          What a magnificent thing it is! When I began my journey into technical
          subjects, I was amazed by how complex it was to print out &quot;
          <span className="no-wrap text-primary dark:text-white">
            Hello World
          </span>
          &quot; in C. Who indeed would need Shakespeare when you have this
          classic masterpiece resounding across the command line? Ever since
          then, I have followed a path based on constant learning and
          exploration. Even in this turbulent world of technology, I still think
          that learning and teaching are ongoing activities which move us forward,
          realizing that development involves more than just writing code - it is
          a harmonious combination of practice, discipline, and a steadfast
          dedication to fundamental principles.
        </p>
        <p className="text-start text-muted-foreground lg:px-6">
          When I&apos;m not at work, I enjoy reading a lot, take an interest in
          writing and have an appreciation for good literature. I make it a point
          of keeping up to date with the latest developments in technology and am
          always on the lookout for new chances to learn and develop. As for the
          future, all I want to do is grasp the essence of what it means{" "}
          <span className="no-wrap text-primary dark:text-white">
            to be an engineer
          </span>
          .
        </p>
      </div>
    </section>
  );
}
