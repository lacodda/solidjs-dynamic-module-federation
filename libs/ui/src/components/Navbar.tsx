import { JSX } from 'solid-js';
import { styled } from 'solid-styled-components';

type NavbarProps<P = {}> = P & { children?: JSX.Element };

const NavbarMenu = styled.div`
    display: flex;
    justify-content: center;
    padding: 1rem;
    gap: 1rem;
    a {
      color: var(--white);
      font-weight: 700;
      text-decoration: none;
      transition: 1s;
      text-transform: uppercase;
      &:hover {
        color: var(--purple);
      }
    }
    input, textarea, select {
      padding: .45rem .5rem;
      border-color: transparent;
      border-radius: 0.5rem;
      font-size: 0.8rem;
      line-height: 0.5rem;
      height: min-content;
      color: var(--black);
    }
    input {
      width: 100%;
    }
  `;

const NavbarContainer = styled.div`
    position: absolute;
    width: 100%;
  `;

export const Navbar = (props: NavbarProps) => (
  <NavbarContainer>
    <NavbarMenu>
      {props.children}
    </NavbarMenu>
  </NavbarContainer>
);

export default Navbar;
