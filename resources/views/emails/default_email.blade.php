<!DOCTYPE html>
<html>
<head>
    <title>Email Template</title>
</head>
<body>
    <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <!-- Header -->
        <tr>
            <td bgcolor="#248ad5" align="center" style="padding: 20px; color: #ffffff;">
                <h1>{{ $appName }}</h1>
            </td>
        </tr>
        <!-- Body -->
        <tr>
            <td bgcolor="#ffffff" align="center" style="padding: 40px;">
                <h2>{{ $title }}</h2>
                <div>
                    {!! $content !!}
                </div>
            </td>
        </tr>
        <!-- Footer -->
        <tr>
            <td bgcolor="#248ad5" align="center" style="padding: 20px; color: #ffffff;">
                <h1>{{ $appName }}</h1>
            </td>
        </tr>
    </table>
</body>
</html>
