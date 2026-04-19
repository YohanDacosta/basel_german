const Footer = () => {
  return (
    <footer className="flex flex-col md:flex-row justify-between items-center mt-4 p-8 h-[80px] w-full bg-[rgba(235,234,234,1)] text-xs">
      <p>
        Copyright © <strong>2025</strong>. Alle Rechte vorbehalten.
      </p>
      <div className="flex space-x-2">
        <p>
          Website erstellt von{" "}
          <span className="font-semibold">Yohan D. Acosta</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
