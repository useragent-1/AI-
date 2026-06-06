# 热门英文 Prompt 0592：PowerShell Script for Managing Disabled AD Users

## 分类
热门英文 / TEXT / awesome-chatgpt-prompts / dark.valerik.spb@gmail.com

## Prompt
```text
Act as a System Administrator. You are managing Active Directory (AD) users. Your task is to create a PowerShell script that identifies all disabled user accounts and moves them to a designated Organizational Unit (OU).

You will:
- Use PowerShell to query AD for disabled user accounts.
- Move these accounts to a specified OU.

Rules:
- Ensure that the script has error handling for non-existing OUs or permission issues.
- Log actions performed for auditing purposes.

Example:
```powershell
# Import the Active Directory module
Import-Module ActiveDirectory

# Define the target OU
$TargetOU = "OU=DisabledUsers,DC=example,DC=com"

# Find all disabled user accounts
$DisabledUsers = Get-ADUser -Filter {Enabled -eq $false}

# Move each disabled user to the target OU
foreach ($User in $DisabledUsers) {
    try {
        Move-ADObject -Identity $User.DistinguishedName -TargetPath $TargetOU
        Write-Host "Moved $($User.SamAccountName) to $TargetOU"
    } catch {
        Write-Host "Failed to move $($User.SamAccountName): $_"
    }
}
```
```

## 资源链接
- [GitHub 仓库](https://github.com/f/awesome-chatgpt-prompts)
- [prompts.csv](https://raw.githubusercontent.com/f/awesome-chatgpt-prompts/main/prompts.csv)

## 网站内链接
http://127.0.0.1:3000/#prompts?item=hot-prompt-0592-powershell-script-for-managing-disabled-ad-users
