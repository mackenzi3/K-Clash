import ProfileComponent from "@/components/profile-component"

export default function UserProfilePage({ params }: { params: { username: string } }) {
  return <ProfileComponent username={params.username} />
}
