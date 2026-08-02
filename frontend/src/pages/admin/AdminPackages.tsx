import PackageTypeAdmin from "./PackageTypeAdmin"

function AdminPackages() {
  return (
    <PackageTypeAdmin
      type="trip"
      pageTitle="Packages"
      pageDescription="Manage the travel packages shown on the public site."
      catalogLabel="Travel Catalog"
      addButtonLabel="Add Package"
      singular="package"
    />
  )
}

export default AdminPackages
