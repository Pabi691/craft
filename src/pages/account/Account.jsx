import Seo from '../../components/Seo';
import AccountShell from './AccountShell';
import Overview from './Overview';
import MyOrders from './MyOrders';
import Addresses from './Addresses';
import Profile from './Profile';

const SECTIONS = {
  Overview,
  'My Orders': MyOrders,
  'My Addresses': Addresses,
  'My Profile': Profile,
};

export default function Account({ section = 'Overview' }) {
  const Section = SECTIONS[section] || Overview;
  return (
    <>
      <Seo title={section} />
      <AccountShell title={section === 'Overview' ? null : section}>
        <Section />
      </AccountShell>
    </>
  );
}
