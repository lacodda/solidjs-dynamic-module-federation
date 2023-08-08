import { styled } from 'solid-styled-components';

const Container = styled.div`
  display: grid;
  justify-content: center;
  align-content: center;
  background: var(--gr-pink-violet);
  width: 100%;
  height: 100%;
`;

const Title = styled.div`
  display: flex;
  h1 {
    font-size: var(--font-size-h1);
    width: max-content;
    text-transform: uppercase;
    background: var(--purple);
    background: var(--gr-violet-purple);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

export const App = () => (
  <Container>
    <Title>
      <h1>App 1</h1>
    </Title>
  </Container>
);

export default App;
