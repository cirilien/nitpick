import { AboutDialog } from "./AboutDialog";
import { ThemeToggle } from "./ThemeToggle";

export const Header = () => {
  return (
    <header className="header-rough relative bg-accent dark:bg-dark-accent px-12 py-6 pb-12 flex items-start justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-surface dark:text-dark-surface">
          <span className="text-accent-warm dark:text-dark-accent-warm">
            &gt;{" "}
          </span>
          NitPick
          <span className="inline-block w-[0.55em] h-[0.15em] bg-surface dark:bg-dark-surface ml-0.5 animate-blink align-baseline" />
        </h1>
        <p className="text-sm text-surface/70 dark:text-dark-surface/70 mt-1">
          Privacy-first, programatic line-editing tools for fiction. No AI
          bullshit, just patterns you might want to double check.{" "}
          <AboutDialog />
        </p>
      </div>
      <ThemeToggle />
    </header>
  );
};
