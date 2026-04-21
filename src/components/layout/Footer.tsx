export function Footer() {
  return (
    <footer className="border-t border-border py-8 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs font-mono text-gray-500">
          © {new Date().getFullYear()} Harry Nguyen
        </p>
        <p className="text-xs font-mono text-gray-600">
          Electrical Engineering · University of British Columbia
        </p>
      </div>
    </footer>
  );
}
