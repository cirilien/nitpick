import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

export const AboutDialog = () => {
  return (
    <Dialog>
      <DialogTrigger className="text-sm text-surface/80 dark:text-dark-surface/80 hover:text-surface dark:hover:text-dark-surface transition-colors underline underline-offset-2 cursor-pointer">
        Learn more
      </DialogTrigger>
      <DialogContent className="font-serif">
        <DialogClose aria-label="Close">&times;</DialogClose>
        <DialogTitle className="font-mono">
          Got questions? Fair enough.
        </DialogTitle>

        <div className="mt-4 space-y-4 text-sm text-text dark:text-dark-text leading-relaxed">
          <Section title="Wtf is this?">
            <p className="mb-3">
              Basically, it's a collection of tools I (the person who made this
              silly little website) find useful when line editing. It's
              calibrated specifically for fiction, and only supports English.
            </p>

            <p className="mb-3">
              The goal is not to tell anyone how to write. Instead, NitPick
              pattern matches against some common writing advice and highlights
              things you <em>might</em> want to change.
            </p>

            <p className="mb-3">
              I built this with the idea that editing is about intentionality.
              If you used the word "suddenly" three times in two paragraphs,
              maybe you wrote that on your phone at two am, or maybe you know
              what you're doing. I don't know which it is, and a computer sure
              as hell doesn't either.
            </p>
            <p>
              Nothing here will tell you if your writing is good. Any software
              that claims to do that is probably full of shit.
            </p>
          </Section>

          <Section title="Privacy &amp; security">
            <p className="mb-3">
              None of your text ever leaves your browser. There's no backend and
              no tracking. All analysis runs client-side in javascript. Whatever
              you paste into the textarea gets saved into local storage in your
              browser so you can refresh the page and not lose it. If that
              bothers you, use an incognito tab.
            </p>
          </Section>

          <Section title="Fuck AI.">
            <p className="mb-3">
              Nothing runs through large language models or anything remotely
              AI. It's mainly good old fashioned for loops for the most part.
              The &ldquo;analysis&rdquo; is just a javascript function which
              parses the text.
            </p>

            <p className="mb-3">
              The nitty gritty of the tech is that it converts your text into a
              Natural Language Concrete Syntax Tree (
              <Link href="https://github.com/syntax-tree/nlcst">NLCST</Link>)
              and uses <Link href="https://unifiedjs.com/">unified.js</Link> and{" "}
              <Link href="https://github.com/retextjs/retext">retext.js</Link>{" "}
              to walk through the text and pattern match. If you want to see
              what it's doing in detail, the source is on GitHub, poke at it at
              your leisure. I made this for fun in my free time, don't expect
              code poetry.
            </p>
          </Section>

          <Section title="Word limit">
            <p className="mb-3">
              Nothing enforced by the application. Some operations are more
              intensive than others, and as this is running entirely on your
              device, performance will depend on the hardware. I'd suggest you
              work scene-by-scene anyway.
            </p>
          </Section>

          <Section title="Mobile support">
            <p className="mb-3">Nope.</p>
          </Section>

          <Section title="Get in touch">
            <p className="mb-3">
              Suggestion? Bug report? Complaint? Sick meme?{" "}
              <Link href="mailto:summon.cirilien@proton.me">
                Send 'em my way
              </Link>
              .
            </p>
          </Section>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Link = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <a
    className="font-bold text-accent dark:text-accent hover:text-accent-hover dark:hover:text-dark-accent-hover transition-colors underline underline-offset-2 cursor-pointer"
    target="_blank"
    rel="noopener"
    href={href}
  >
    {children}
  </a>
);

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div>
    <h3 className="font-mono font-bold text-text dark:text-dark-text mb-2">
      {title}
    </h3>
    {children}
  </div>
);
