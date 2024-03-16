import Navbar from '../navbar';
import ProfileData from '../profile/profile-data';

const ProfilePage = () => {
	return (
		<>
			<Navbar />
			<div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
				<ProfileData />
			</div>
		</>
	);
};

export default ProfilePage;
