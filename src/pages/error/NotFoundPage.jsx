import React from 'react';
import * as Mui from '@mui/material';
import * as Icon from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hook/provider/AuthContext'
import { UI_SETTING } from '../../theme/uiSetting';
import ErrorImage from '../../asset/Miku.gif';

const NotFoundPage = () => {
    const { user } = useAuth()

    return (
        <Mui.Box sx={{
            bgcolor: 'background.default',
            color: 'text.primary',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            // Gaming pattern giả lập
            backgroundImage: (theme) => `radial-gradient(circle at 2px 2px, ${theme.palette.divider} 1px, transparent 0)`,
            backgroundSize: '24px 24px',
        }}>

            {/* MAIN CONTENT */}
            <Mui.Box component="main" sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', px: 3, py: 10 }}>

                <Mui.Box sx={{ position: 'relative', mb: 8, textAlign: 'center' }}>

                    {/* Cụm trung tâm chứa ảnh */}
                    <Mui.Box sx={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                        <Mui.Box
                            component="img"
                            src={ErrorImage}
                            sx={{
                                width: { xs: 500, md: 600 },
                                height: 'auto',
                                filter: 'drop-shadow(0px 10px 20px rgba(128, 128, 128, 0.3))',
                                animation: 'float 3s ease-in-out infinite',
                                '@keyframes float': {
                                    '0%, 100%': { transform: 'translateY(0)' },
                                    '50%': { transform: 'translateY(-15px)' },
                                }
                            }}
                        />

                        <Mui.Typography variant="h3" sx={{ fontWeight: 800, mb: 2, textTransform: 'uppercase', letterSpacing: -1 }}>
                            CAN YOU COOK?
                        </Mui.Typography>
                        <Mui.Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 450, fontSize: '1.1rem', fontWeight: 500 }}>
                            Trong Đây Không Có Gì Đâu, Vui Lòng "COOK" Ra Chỗ Khác Chơi
                        </Mui.Typography>
                    </Mui.Box>
                </Mui.Box>

                {/* NÚT ĐIỀU HƯỚNG CHÍNH */}
                <Mui.Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: '100%', maxWidth: 480 }}>
                    <Mui.Button
                        fullWidth
                        variant="contained"
                        component={Link} to="/"
                        startIcon={<Icon.Home />}
                        sx={{ py: 2, borderRadius: 2, fontWeight: 700, bgcolor: 'text.primary', color: 'background.paper', '&:hover': { bgcolor: 'primary.main' } }}
                    >
                        BACK TO HOME
                    </Mui.Button>
                    {user?.isAdmin && (
                        <Mui.Button
                            fullWidth
                            variant="outlined"
                            component={Link}
                            to="/admin"
                            startIcon={<Icon.AdminPanelSettings />}
                            sx={{ py: 2, borderRadius: 2, fontWeight: 700, borderColor: 'primary.main', color: 'primary.main', '&:hover': { bgcolor: 'primary.main', color: 'background.paper', borderColor: 'primary.main' } }}
                        >
                            ADMIN PANEL
                        </Mui.Button>
                    )}
                </Mui.Stack>

            </Mui.Box>

            {/* FOOTER */}
            <Mui.Box component="footer" sx={{ p: 5, borderTop: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
                <Mui.Stack direction="row" spacing={4} justifyContent="center" sx={{ mb: 3, color: 'text.secondary' }}>
                    <Icon.Chat /> <Icon.Groups /> <Icon.RssFeed />
                </Mui.Stack>
                <Mui.Typography variant="caption" sx={{ fontWeight: 600, letterSpacing: '0.1em', opacity: 0.6 }}>
                    © 2024 CYBERCONSOLE GAMING STORE. ALL RIGHTS RESERVED.
                </Mui.Typography>
            </Mui.Box>
        </Mui.Box>
    );
};

export default NotFoundPage;