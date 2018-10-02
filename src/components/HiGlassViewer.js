import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

// Components
import ErrorMsgCenter from './ErrorMsgCenter';
import HiGlassLauncher from './HiGlassLauncher';
import SpinnerCenter from './SpinnerCenter';

// Containers
import HiGlassLoader from '../containers/HiGlassLoader';

// Actions
import { setViewConfig } from '../actions';

// Services
import pubSub from '../services/pub-sub';

// Utils
import { Deferred, Logger } from '../utils';

// Styles
import './HiGlassViewer.scss';

const logger = Logger('HiGlassViewer');

const fetchViewConfig = (configId, base = '') => fetch(
  `${base}/api/v1/viewconfs/?d=${configId}`
).then(response => response.json());

const defaultViewConfigId = 'default';


class HiGlassViewer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: '',
      isLoading: true,
    };
  }

  componentDidMount() {
    this.loadViewConfig();
  }

  componentDidUpdate(prevProps) {
    if (this.props.viewConfigId !== prevProps.viewConfigId) {
      this.loadViewConfig();
    }
  }

  /* ---------------------------- Custom Methods ---------------------------- */

  confirmViewConfigChange() {
    const dialog = new Deferred();
    pubSub.publish(
      'globalDialog',
      {
        message: 'You are about to override the existing view config.',
        request: dialog,
        rejectText: 'Cancel',
        resolveText: 'Okay',
      }
    );
  }

  loadViewConfig(viewConfigId = this.props.viewConfigId) {
    if (!viewConfigId && this.props.viewConfig) {
      this.setState({
        error: '',
        isLoading: false,
      });
      return;
    }

    this.setState({
      error: '',
      isLoading: true,
    });

    fetchViewConfig(viewConfigId || defaultViewConfigId)
      .then(this.setViewConfig.bind(this))
      .catch(() => {
        logger.info(
          'View config is not available locally! Try loading it from higlass.io.'
        );

        // Try loading config from HiGlass.io
        return fetchViewConfig(
          viewConfigId || defaultViewConfigId, 'http://higlass.io'
        );
      })
      .then(this.setViewConfig.bind(this))
      .catch((error) => {
        logger.error('Could not load or parse config.', error);
        this.setState({
          error: 'Could not load config.',
          isLoading: false,
        });
      });
  }

  onError(error) {
    this.setState({
      error,
      isLoading: false,
    });
  }

  setViewConfig(viewConfig) {
    if (!viewConfig || viewConfig.error) {
      const errorMsg = viewConfig && viewConfig.error
        ? viewConfig.error
        : 'View config broken.';
      this.setState({
        error: errorMsg,
        isLoading: false,
      });
    } else if (this.props.isStatic) {
      this.setState({
        error: '',
        isLoading: false,
        viewConfigStatic: viewConfig,
      });
    } else {
      this.props.setViewConfig(viewConfig);
      this.setState({
        error: '',
        isLoading: false,
      });
    }
  }

  /* -------------------------------- Render -------------------------------- */

  render() {
    let className = 'higlass-viewer';

    className += this.props.hasSubTopBar ? ' has-sub-top-bar' : '';
    className += !this.props.autoExpand && !this.props.height ? ' full-dim' : '';
    className += this.props.height ? ' higlass-viewer-abs-height' : '';
    className += this.props.hasSubTopBar ? ' has-sub-top-bar' : '';

    const style = {
      height: this.props.height ? `${this.props.height}px` : 'auto',
    };

    return (
      <div
        className={className}
        style={style}
      >
        {this.state.error && <ErrorMsgCenter msg={this.state.error}/>}
        {!this.state.error && (
          this.state.isLoading ? (  // eslint-disable-line no-nested-ternary
            <SpinnerCenter />
          ) : (
            this.props.isStatic ? (
              <HiGlassLauncher
                api={this.props.api}
                autoExpand={this.props.autoExpand}
                enableAltMouseTools={this.props.enableAltMouseTools}
                onError={this.onError.bind(this)}
                viewConfig={this.state.viewConfigStatic}
                isPadded={this.props.isPadded}
                isZoomFixed={this.props.isZoomFixed}
              />
            ) : (
              <HiGlassLoader
                api={this.props.api}
                enableAltMouseTools={this.props.enableAltMouseTools}
                onError={this.onError.bind(this)}
                isPadded={this.props.isPadded}
                isZoomFixed={this.props.isZoomFixed}
              />
            )
          )
        )}
      </div>
    );
  }
}

HiGlassViewer.defaultProps = {
  api: () => {},
};

HiGlassViewer.propTypes = {
  api: PropTypes.func,
  autoExpand: PropTypes.bool,
  className: PropTypes.string,
  enableAltMouseTools: PropTypes.bool,
  hasSubTopBar: PropTypes.bool,
  height: PropTypes.number,
  isPadded: PropTypes.bool,
  isStatic: PropTypes.bool,
  isZoomFixed: PropTypes.bool,
  setViewConfig: PropTypes.func.isRequired,
  viewConfig: PropTypes.object,
  viewConfigId: PropTypes.string,
};

const mapStateToProps = state => ({
  viewConfig: state.present.viewConfig,
});

const mapDispatchToProps = dispatch => ({
  setViewConfig: (viewConfig) => {
    dispatch(setViewConfig(viewConfig));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(HiGlassViewer);
