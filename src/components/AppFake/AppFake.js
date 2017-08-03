import PropTypes from 'prop-types';
import React from 'react';

// Components
import Content from '../Content/Content';
import ContentWrapper from '../ContentWrapper/ContentWrapper';
import ErrorMsgCenter from '../ErrorMsg/ErrorMsgCenter';
import Icon from '../Icon/Icon';
import SpinnerCenter from '../../components/Spinner/SpinnerCenter';

// Styles
import '../Footer/Footer.scss';
import '../TopBar/TopBar.scss';

const AppLoading = props => (
  <div className='app full-mdim'>
    <header className='top-bar'>
      <div className='flex-c flex-jc-sb top-bar-wrapper wrap'>
        <div className='flex-c branding-launch'>
          <a href='/' className='flex-c flex-a-c branding'>
            <Icon iconId='logo-two-tone' />
            <span className='higlass'><span className='higlass-hi'>Hi</span>Glass</span>
          </a>
        </div>
        <nav className='flex-c flex-jc-e flex-a-s is-toggable'>
          <ul className='flex-c flex-jc-e flex-a-s no-list-style'>
            <li><a href='/about'>About</a></li>
            <li><a href='/examples'>Examples</a></li>
            <li><a href='/docs'>Docs</a></li>
            <li className='separated-left flex-c flex-jc-c'>
              <a
                href='https://github.com/hms-dbmi?&q=higlass'
                target='_blank'
                rel='noopener noreferrer'
                className='icon-only flex-c flex-a-c'>
                <Icon iconId='github' />
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
    <ContentWrapper name='app-loading'>
      <Content name='app-loading' rel={true} wrap={true}>
        {props.error ?
          <ErrorMsgCenter msg={props.error} /> :
          <SpinnerCenter delayed={true} />
        }
      </Content>
      <footer className="footer">
        <div className="wrap flex-c flex-a-c flex-jc-sb">
          <div className="flex-c flex-a-c flex-v">
            <div className="flex-c">
              <Icon iconId="logo-hms" title="Harvard Medical School" />
              <Icon iconId="logo-seas" title="Harvard John A. Paulson School of Engineering and Applied Sciences" />
              <Icon iconId="logo-mit" title="Massachusetts Institute of Technology" />
            </div>
            <p className="copyright">&copy; 2017 <a href='/about#copyright'>Harvard College</a>.</p>
          </div>

          <nav>
            <ul className='flex-c flex-jc-e flex-a-s no-list-style'>
              <li><a href='/'>Home</a></li>
              <li><a href='/about' >About</a></li>
              <li><a href='/examples' >Examples</a></li>
              <li><a href='/docs' >Docs</a></li>
            </ul>
          </nav>
        </div>
      </footer>
    </ContentWrapper>
  </div>
);

AppLoading.propTypes = {
  error: PropTypes.string,
};

export default AppLoading;