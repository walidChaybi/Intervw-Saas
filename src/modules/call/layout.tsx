interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return <div className="flex h-screen w-screen bg-black">{children}</div>;
};

export default Layout;
