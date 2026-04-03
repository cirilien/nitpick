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
        <DialogTitle className="font-mono">Got questions? Good.</DialogTitle>

        <div className="mt-4 space-y-4 text-sm text-text dark:text-dark-text leading-relaxed">
          <Section title="Wtf is this?">
            <p className="mb-3">
              Basically, it's a collection of tools I (the person who made this
              silly little website) find useful when line editing. It's
              calibrated specifically for fiction, and only supports English.
            </p>

            <p className="mb-3">
              The intention is not to tell anyone how to write, or even make
              suggestions. Instead it pattern matches against some common
              writing advice and highlights things you <em>might</em> want to
              change.
            </p>

            <p className="mb-3">
              I built this with the idea that editing is about intention. If you
              used the word "suddenly" three times in two paragraphs, maybe you
              wrote that on your phone at two am, or maybe you know what you're
              doing. I don't know which it is, and a computer sure as hell
              doesn't either.
            </p>
            <p>
              Nothing here will tell you if your writing is good. Any software
              that claims to do that is probably full of shit.
            </p>
          </Section>

          <Section title="Privacy &amp; Security">
            <p className="mb-3">
              None of your text ever leaves your browser. There's no backend and
              no tracking. Everything runs client-side in javascript. Whatever
              you paste into the textarea gets saved into localstorage in your
              browser. If that bothers you, hit that incognito button.
            </p>
          </Section>

          <Section title="Mobile support">
            <p className="mb-3">Nope.</p>
          </Section>

          <Section title="Fuck AI.">
            <p className="mb-3">
              Zero use of large language models. Mainly old fashioned for loops
              for the most part. The &ldquo;analysis&rdquo; is just a few
              javascript functions which parse the text. If you want to see what
              it's doing, the source is on GitHub, poke at it at your leisure.
            </p>

            <p className="mb-3">
              The nitty gritty of the tech is that it converts your text into a
              Natural Language Concrete Syntax Tree (
              <Link href="https://github.com/syntax-tree/nlcst">NLCST</Link>)
              and uses <Link href="https://unifiedjs.com/">unified.js</Link> and{" "}
              <Link href="https://github.com/retextjs/retext">retext.js</Link>{" "}
              to walk through the text and pattern match.
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
