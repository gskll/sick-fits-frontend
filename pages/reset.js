import RequestReset from '../components/RequestReset';
import Reset from '../components/Reset';

export default function reset({ query }) {
  if (!query?.token) {
    return (
      <>
        <p>You must supply a token</p>
        <RequestReset />
      </>
    );
  }
  return (
    <div>
      <Reset token={query.token} />
    </div>
  );
}
