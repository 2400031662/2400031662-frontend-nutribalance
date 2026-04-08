function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} <span className="font-semibold">NutriBalance</span>. All rights reserved.
        </p>
        <div className="flex flex-wrap gap-3">
          <span>Secure • Role-based access • Encrypted data</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

