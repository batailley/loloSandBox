import type { HostFeature, HostMe } from '@lolo/shared/schemas';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { fetchHostFeatures, fetchHostMe } from '../api/bff';
import { BodySandbox } from './BodySandbox';
import { Header } from './Header';
import { NavDrawer } from './NavDrawer';

export function HostLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [user, setUser] = useState<HostMe | null>(null);
  const [features, setFeatures] = useState<HostFeature[]>([]);

  useEffect(() => {
    fetchHostMe().then(setUser).catch(console.error);
    fetchHostFeatures()
      .then((r) => setFeatures(r.features))
      .catch(console.error);
  }, []);

  return (
    <>
      <Header user={user} onBurgerClick={() => setDrawerOpen((v) => !v)} />
      <NavDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} features={features} />
      <BodySandbox>
        <Outlet />
      </BodySandbox>
    </>
  );
}
