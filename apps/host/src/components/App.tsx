
import { For, createEffect, createSignal } from 'solid-js';
import { styled } from 'solid-styled-components';
import { LoadRemoteModule } from '@libs/utils';
import { Navbar, Button } from '@libs/ui';
import { Dynamic } from 'solid-js/web';

const AppContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const Container = styled.div`
  display: grid;
  justify-content: center;
  align-content: center;
  background: var(--gr-azure-pink);
  width: 100%;
  height: 100%;
`;

const Title = styled.div`
  display: flex;
  h1 {
    font-size: var(--font-size-h1);
    width: max-content;
    text-transform: uppercase;
    background: var(--teal);
    background: var(--gr-teal-blue);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const App = () => {
  const [apps, setApps] = createSignal<string[]>([]);
  const [selected, setComponent] = createSignal<string>('');
  const [host, setHost] = createSignal<string>(process.env.APPS_URL ?? '');
  const [dynamicComponent, setDynamicComponent] = createSignal<any>(null);
  const loadRemoteModule = new LoadRemoteModule();

  function loadServers (): void {
    void (async () => {
      await loadRemoteModule.setHost(host()).loadServers();
      setApps(loadRemoteModule.apps);
    })();
  }

  createEffect(() => {
    void (async () => {
      if (!selected()) {
        setDynamicComponent(null);
        return;
      }

      setDynamicComponent((await loadRemoteModule.loadComponent(selected(), './Module')).default);
    })();
  }, [selected]);

  return (
    <AppContainer>
      <Navbar>
        <input value={host()} onInput={(event) => { setHost((event.target as unknown as HTMLTextAreaElement).value); }} />
        <Button onClick={() => { loadServers(); }}>Download</Button>
        <select value={selected()} onInput={(event) => setComponent(event.target.value)}>
          <option value="">Please select one</option>
          <For each={apps()}>{
            app => <option value={app}>{app}</option>
          }</For>
        </select>
      </Navbar>
      { dynamicComponent() && <Dynamic component={dynamicComponent()} /> }
      { !dynamicComponent() &&
        <Container>
          <Title>
            <h1>Host</h1>
          </Title>
        </Container>
      }
    </AppContainer>
  );
};

export default App;
