import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { utils } from 'ethers';

import { Theme } from '@mui/material/styles';

import makeStyles from '@mui/styles/makeStyles';
import createStyles from '@mui/styles/createStyles';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';

import { toast } from 'sonner'

import { Formik, Form, Field, useFormikContext } from 'formik';
import { TextField } from 'formik-mui';
import * as yup from 'yup';

import { PropsFromRedux } from '../containers/BundleManagerContainer';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: 0,
      paddingRight: 0,
    },
    newBundleInMemoryContainer: {
      width: '100%',
      padding: theme.spacing(2),
      borderRadius: theme.shape.borderRadius,
      display: 'flex',
      flexDirection: 'column',
      borderColor: 'rgba(255, 255, 255, 0.23)',
      border: '1px solid',
    },
    bundleMemoryAddressEntrySpacer: {
      marginTop: theme.spacing(2),
    },
    fieldSpacer: {
      marginTop: theme.spacing(4),
    },
    bundleMemoryActionContainer: {
      display: 'flex',
      justifyContent: 'flex-start',
    },
  }),
);

const ValidationSchema = yup.object().shape({
  address: yup.string().test("valid-eth-address", "Wallet address must be a valid ETH address", (value) => {
    try {
      if(value) {
        if(value.length > 0) {
          return utils.isAddress(value);
        }
      }
      return true;
    } catch (e) {
      return false;
    }
  }),
});

interface IAddToBundleField {
  address: string
}

const BundleAddressInputAutoHandler = () => {
  const { values, submitForm } = useFormikContext<IAddToBundleField>();
  useEffect(() => {
    if (utils.isAddress(values.address)) {
      submitForm();
    }
  }, [values, submitForm]);
  return null;
};

const BundleManager = (props: PropsFromRedux) => {

    const {
      saveAddressBundle,
      addressBundles,
    } = props;

    let navigate = useNavigate();

    const classes = useStyles();

    const [addressList, setAddressList] = useState<string[]>([]);

    const saveMemoryBundle = () => {
      saveAddressBundle({
        name: '',
        addresses: addressList,
      })
      setAddressList([]);
      toast.success("Saved new address bundle");
    }

    return (
      <div>
        <div
          className={classes.fieldSpacer}
        >
          <Formik
            initialValues={{
              address: '',
            }}
            validationSchema={ValidationSchema}
            onSubmit={async (values, { resetForm, setSubmitting }) => {
              try {
                setSubmitting(true);
                resetForm();
                let checksumAddress = utils.getAddress(values.address);
                let reinsertNotice = false;
                if(addressList.indexOf(checksumAddress) > -1) {
                  reinsertNotice = true;
                }
                const newArray = [...addressList].filter((item) => item !== checksumAddress);
                setAddressList([checksumAddress, ...newArray]);
                setSubmitting(false);
                if(reinsertNotice) {
                  toast.success("Address was already part of the list, so we moved it to the top");
                } else {
                  toast.success("Added address to pending bundle");
                }
              } catch(e) {
                console.log({e})
                setSubmitting(false);
                toast.error("Unable to add address, please try again or reach out for help");
              }
            }}
          >
            {({ submitForm, isSubmitting }) => (
              <Form>
                <Field
                  component={TextField}
                  fullWidth
                  name="address"
                  type="text"
                  label={`Add ${addressList.length > 0 ? 'Another' : ''} Wallet Address`}
                />
                <BundleAddressInputAutoHandler/>
                {/* <div className={classes.submitButtonContainer}>
                  <FloatingActionButton
                    className={classes.submitButton}
                    disabled={isSubmitting}
                    onClick={submitForm}
                    text="Next"
                  />
                </div> */}
              </Form>
            )}
          </Formik>
        </div>
        {(addressList.length > 0) &&
          <div>
            <Typography className={classes.fieldSpacer} style={{textAlign: 'center'}} variant="h4">
              New Bundle
            </Typography>
            <div className={[classes.newBundleInMemoryContainer, classes.fieldSpacer, 'hover-white-border', 'disable-pointer-events'].join(" ")}>
              {addressList.map((item, index) => (
                <Button key={`memory-bundle-${index}-${item}`} color="secondary" variant="outlined" className={[(index > 0 ? classes.bundleMemoryAddressEntrySpacer : ''), 'disable-text-transform', 'disable-pointer-events', 'width-full'].join(" ")}>{item}</Button>
              ))}
            </div>
            <div className={[classes.fieldSpacer, classes.bundleMemoryActionContainer].join(" ")}>
              <Button className="width-full" color="secondary" variant="contained" onClick={() => saveMemoryBundle()}>Save New Bundle</Button>
            </div>
          </div>
        }
        {(addressBundles.length > 0) &&
          <div>
            <Typography className={classes.fieldSpacer} style={{textAlign: 'center'}} variant="h4">
              Saved Address Bundles
            </Typography>
            {addressBundles.map((addressBundle, bundleIndex) => 
              <div key={`persist-bundle-address-${bundleIndex}-${addressBundle.name}`}>
                <CardActionArea onClick={() => navigate(`/portfolio?addresses=${addressBundle.addresses.map((linkItem) => linkItem)}`)} className={[classes.newBundleInMemoryContainer, classes.fieldSpacer, 'hover-white-border'].join(" ")}>
                  {addressBundle.addresses.map((bundleItem, bundleItemIndex) => (
                    <Button
                      component="div"
                      key={`persist-bundle-address-${bundleIndex}-${bundleItemIndex}-${bundleItem}`}
                      variant="outlined"
                      color="secondary"
                      className={[(bundleItemIndex > 0 ? classes.bundleMemoryAddressEntrySpacer : ''), 'disable-text-transform', 'disable-pointer-events', 'width-full'].join(" ")}
                    >
                      {bundleItem}
                    </Button>
                  ))}
                </CardActionArea>
              </div>
            )}
          </div>
        }
      </div>
    )
}

export default BundleManager;