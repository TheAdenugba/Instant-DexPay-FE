import Image from 'next/image';
import { SimpleDialogProps } from '@/store/models/modalProps'
import { useBreakPoints } from '@/utils';
import Assets from '@/utils/assets';
import React from 'react'
import { SwitchNetworkStyle } from './ModalStyles';
import { Button, Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';

const SwitchNetwork = ({ onClose, open, selectedValue, onClickSwitch }: SimpleDialogProps) => {
    const { CANCELLED, WARNING } = Assets;
    const { sm, } = useBreakPoints();
    const classes = SwitchNetworkStyle();
    const handleClose = () => {
        onClose(selectedValue);
    };
    return (
        <Dialog
            className={classes.dialog}
            onClose={handleClose}
            open={open}
            classes={{
                paper: classes.dialogPaperDark,
            }}
        >
            <DialogTitle>
                <div className={classes.titleDiv}>
                    <Typography
                        fontSize={sm ? "21px" : "16px"}
                        variant="body2"
                        className={classes.titleText}
                    >
                        Switch Network
                    </Typography>
                    <Image
                        src={CANCELLED}
                        alt="cancelled"
                        width={18}
                        height={18}
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                            handleClose();
                        }}
                    />
                </div>
            </DialogTitle>
            <DialogContent>
                <div className={classes.walletDiv}>
                    <div className={classes.warningDiv}>
                        <Image
                            src={WARNING}
                            className={classes.warningIcon}
                            alt="warning"
                            width={48}
                            height={48}
                        />
                        <Typography className={classes.warningHeaderText}>
                            Wrong Network selected
                        </Typography>
                        <Typography variant="body2" className={classes.warningBodyText}>
                            DexPay is not available on your current network, pls switch back
                            to binance smart chain testnet
                        </Typography>
                    </div>
                    <div className={classes.btnDiv}>
                        <Button
                            onClick={() => onClickSwitch()}
                            sx={{
                                marginTop: "48px",
                                color: "#111217",
                                backgroundColor: "#FFFFFF",
                                borderRadius: "64px",
                                textTransform: "none",
                                fontSize: "14px",
                                fontWeight: 500,
                                fontStyle: "normal",
                                lineHeight: "17px",
                                display: "block",
                                padding: "16px 18px 16px 18px",
                                width: "100%",
                                "&:hover": {
                                    backgroundColor: "#FC3F6B",
                                    color: "#fff",
                                },
                            }}
                        >
                            Switch Network
                        </Button>
                    </div>
                </div>
                <Typography variant="h6" className={classes.footerText}>
                    Don’t know to to switch network?{" "}
                    <a
                        href="https://dexpay.io/faq"
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: "#FC3F6B" }}
                    >
                        Read our FAQ
                    </a>
                </Typography>
            </DialogContent>
        </Dialog>
    )
}

export default SwitchNetwork