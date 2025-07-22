module SessionHelper
  def sign_in(email: 'admin@example.com', password: 'password1234')
    visit sign_in_path

    fill_in "Email", with: email
    fill_in "Password", with: password
    click_on "Sign in"
    expect(page).not_to have_content("Sign in"), "Sign in failed"
  end
end